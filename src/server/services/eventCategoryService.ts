import { currentUser } from "@clerk/nextjs/server";
import EventCategory from "../models/EventCategory";

export async function eventCategoryService(categoryName: string, color: number, emoji?: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const userId = user.id;

  let eventCategory = await EventCategory.findOne({ name: categoryName, userId });

  if (!eventCategory) {
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