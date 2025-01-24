import { currentUser } from "@clerk/nextjs/server";
import EventCategory from "../models/EventCategory";

export async function eventCategoryService(categoryName: string, color: string, emoji?: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const userId = user.id;

  // Check if the category exists
  let eventCategory = await EventCategory.findOne({ name: categoryName, userId });

  if (!eventCategory) {
    // Create new category if it doesn't exist
    eventCategory = new EventCategory({
      name: categoryName,
      color,
      emoji,
      userId: userId,
    });
    await eventCategory.save();
  }

  return eventCategory;
}