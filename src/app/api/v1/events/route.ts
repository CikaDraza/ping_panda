import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import User from "@/server/models/User";
import Quota from "@/server/models/Quota";
import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import DiscordClient from "@/lib/discord-client";
import Event from "@/server/models/Event";
import Joi from "joi";
import EventCategory from "@/server/models/EventCategory";

export const POST = async (req: NextRequest) => {
  try {
    await db.connect();

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Invalid or missing Authorization header." }, { status: 401 });
    }

    const apiKey = authHeader.split(" ")[1];

    const user = await User.findOne({ apiKey })
    .populate('eventCategories')
    .exec();

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
    } else {
      console.log("User found:", user, "Event Category:", user?.eventCategories);
      NextResponse.json({ message: "User found" }, { status: 200 });
    }

    if (!user.discordId) {
      return NextResponse.json({ message: "Please enter your discord ID in your account settings" }, { status: 403 })
    }

    const requestData = await req.json();

    console.log(requestData);
    

    if (!requestData) {
      return NextResponse.json({ message: "Invalid JSON request body" }, { status: 400 })
    }

    const schema = Joi.object({
      category: Joi.string().regex(/^[a-zA-Z0-9-\s]+$/).required().messages({
        "string.pattern.base": "Category name can only contain letters, numbers, hyphens, or spaces."
      }),
      fields: Joi.object().required(),
    });    
    
    const { error, value: validationData } = schema.validate(requestData);
    if (error) {
      return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    const category = user?.eventCategories.find((cat: { name: any; }) => cat.name === requestData.category);

    if (!category) {
      return NextResponse.json({ message: `Category "${requestData.category}" not found. Here in user category: ${requestData}` }, { status: 404 });
    }

    const eventData = {
      title: `${category.emoji || "🔔"} ${category.name.charAt(0).toUpperCase() + category.name.slice(1)}`,
      description: validationData.description || `A new ${category.name} event has occurred!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationData.fields || {}).map(([key, value]) => {
        return {
          name: key,
          value: String(value),
          inline: true
        }
      })
    }    

    const event = new Event({
      name: category.name,
      formattedMessage: `${eventData.title}\n\n${eventData.description}`,
      userId: user.id,
      eventCategoryId: category._id,
      fields: validationData.fields
    });

    await event.save();

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    let quota = await Quota.findOne({ userId: user.externalId, month: currentMonth, year: currentYear });

    if (!quota) {
      quota = new Quota({ userId: user.externalId, month: currentMonth, year: currentYear, count: 1 });
    } else {
      quota.count += 1;
    }
    
    await quota.save();

    const quotaLimit = user.plan === "FREE" ? FREE_QUOTA.maxEventsPerMonth : PRO_QUOTA.maxEventsPerMonth

    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json({ message: "Monthly quota reached. Please upgrade your plan for more events" }, { status: 429 })
    }

    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)

    const dmChannel = await discord.createDM(user.discordId)
    
    try {
      await discord.sendEmbed(dmChannel.id, eventData)
      
      await Event.findOneAndUpdate(
        { userId: user.id },
        { $set: { deliveryStatus: "DELIVERED" } },
        { new: true }
      );

    } catch (error) {

      await Event.findOneAndUpdate(
        { userId: user.id },
        { $set: { deliveryStatus: "FAILED" } },
        { new: true }
      );
      
      return NextResponse.json(
        { message: error || "Error procesing event." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Event created successfully", event: { id: event.userId, name: event.name } });

  } catch (error) {
    console.error("Error in user sync:", error);
    return NextResponse.json(
      { message: error || "Internal server error." },
      { status: 500 }
    );
  } finally {
    await db.disconnect();
  }
};
