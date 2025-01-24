import { currentUser } from "@clerk/nextjs/server";
import cuid from "cuid";
import User, { Plan } from "../models/User";

export async function syncUserFromClerk() {
  const user = await currentUser();

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const externalId = user.id;
  const email = user.emailAddresses[0]?.emailAddress;

  if (!externalId || !email) {
    throw new Error("User data is incomplete: missing externalId or email.");
  }

  let existingUser = await User.findOne({ externalId });

  if (existingUser) {
    existingUser.email = email;
    existingUser.updatedAt = new Date();
  } else {
    existingUser = new User({
      externalId,
      apiKey: cuid(),
      email,
      quotaLimit: 1000,
      plan: Plan.FREE,
    });
  }

  await existingUser.save();
  return existingUser;
}