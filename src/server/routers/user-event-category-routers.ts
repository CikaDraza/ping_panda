import { NextResponse } from "next/server";
import db from "@/db";
import { eventCategoryService } from "@/server/services/eventCategoryService";
import { currentUser } from "@clerk/nextjs/server";
import EventCategory from "@/server/models/EventCategory";

export async function GET() {
  try {
    await db.connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    const userId = user.id;
    const eventCategories = await EventCategory.find({ userId });

    return NextResponse.json(eventCategories, { status: 200 });
  } catch (error) {
    console.error("Error fetching event categories:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error },
      { status: 500 }
    );
  } finally {
    db.disconnect();
  }
}

export async function POST(request: Request) {
  try {
    await db.connect();

    const { categoryName, color, emoji } = await request.json();

    if (!categoryName || !color) {
      return NextResponse.json(
        { message: "Category name and color are required." },
        { status: 400 }
      );
    }

    const eventCategory = await eventCategoryService(categoryName, color, emoji);

    return NextResponse.json(
      { message: "Category successfully added.", eventCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event category:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error },
      { status: 500 }
    );
  } finally {
    db.disconnect();
  }
}