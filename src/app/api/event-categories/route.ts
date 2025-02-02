import { NextResponse } from "next/server";
import db from "@/db";
import { eventCategoryService } from "@/server/services/eventCategoryService";
import { currentUser } from "@clerk/nextjs/server";
import EventCategory, { IEventCategory } from "@/server/models/EventCategory";
import { startOfMonth } from "date-fns";
import Event from "@/server/models/Event";

export async function GET(request: Request) {

  try {

    await db.connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }
    
    const userId = user.id;
    const eventCategories = await EventCategory.find({ userId }).lean<IEventCategory>();

    const categoriesWithStats: IEventCategory[] = await Promise.all(
      eventCategories.map(async (category: { _id: { toString: () => any; }; }) => {

        const lastEvent = await Event.findOne({ eventCategoryId: category._id })
          .sort({ createdAt: -1 })
          .select("createdAt");

        const uniqueFieldsSet = new Set();
        const events = await Event.find({ eventCategoryId: category._id });
        events.forEach((event) => {
          Object.keys(event.fields).forEach((key) => uniqueFieldsSet.add(key));
        });

        const eventsThisMonth = await Event.countDocuments({
          eventCategoryId: category._id,
          createdAt: { $gte: startOfMonth(new Date()) },
        });

        return {
          ...category,
          _id: category._id.toString(),
          lastPing: lastEvent?.createdAt ? new Date(lastEvent.createdAt) : null,
          uniqueFields: uniqueFieldsSet.size,
          eventsThisMonth,
        };
        
      })
    );

    return NextResponse.json(categoriesWithStats, { status: 200 });
  } catch (error) {
    console.error("Error fetching event categories:", error);
    return NextResponse.json({ message: error || "Internal server error." }, { status: 500 });
  } finally {
    db.disconnect();
  }
}

export async function POST(request: Request) {
  try {
    await db.connect();

    const { categoryName, color, emoji } = await request.json();
    const eventCategory = await eventCategoryService(categoryName, color, emoji);

    return NextResponse.json({ message: "Category successfully added.", eventCategory }, { status: 200 });
  } catch (error) {
    console.error("Error creating event category:", error);
    return NextResponse.json({ message: error || "Internal server error." }, { status: 500 });
  } finally {
    db.disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    await db.connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json({ message: "Category ID is required." }, { status: 400 });
    }

    const eventCategory = await EventCategory.findOneAndDelete({ _id: categoryId, userId });

    if (!eventCategory) {
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Category successfully deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event category:", error);
    return NextResponse.json({ message: error || "Internal server error." }, { status: 500 });
  } finally {
    db.disconnect();
  }
}