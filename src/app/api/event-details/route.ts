import { NextResponse } from "next/server";
import db from "@/db";
import Event from "@/server/models/Event";
import { currentUser } from "@clerk/nextjs/server";
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function GET(request: Request) {
  try {
    await db.connect();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const period = searchParams.get("period"); // "today", "week", "month"

    if (!categoryId) {
      return NextResponse.json({ message: "Category ID is required." }, { status: 400 });
    }

    const today = new Date();
    const timeZone = "Europe/Belgrade";

    let startDate, endDate;    

    switch (period) {
      case "today":
        startDate = toZonedTime(startOfDay(today), timeZone);
        endDate = toZonedTime(endOfDay(today), timeZone);
        break;
      case "week":
        startDate = toZonedTime(startOfWeek(today, { weekStartsOn: 1 }), timeZone);
        endDate = toZonedTime(endOfWeek(today, { weekStartsOn: 1 }), timeZone);
        break;
      case "month":
        startDate = toZonedTime(startOfMonth(today), timeZone);
        endDate = toZonedTime(endOfMonth(today), timeZone);
        break;
      default:
        return NextResponse.json({ message: "Invalid period." }, { status: 400 });
    }

    const getDateRange = (period: string) => {
      switch (period) {
        case "today":
          return { start: startOfDay(today), end: endOfDay(today) };
        case "week":
          return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
        case "month":
          return { start: startOfMonth(today), end: endOfMonth(today) };
        default:
          return null;
      }
    };

    const periods = ["today", "week", "month"];
    const counts: Record<string, number> = {};

    for (const period of periods) {
      const range = getDateRange(period);
      if (range) {
        counts[period] = await Event.countDocuments({
          eventCategoryId: categoryId,
          createdAt: { $gte: range.start, $lte: range.end },
        });
      }
    }

    const events = await Event.find({
      eventCategoryId: categoryId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).select("fields formattedMessage deliveryStatus createdAt");
console.log('counts', counts);

    return NextResponse.json({ events, counts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    db.disconnect();
  }
}
