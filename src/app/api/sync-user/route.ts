import { NextResponse } from "next/server";
import { syncUserFromClerk } from "@/server/services/userService";
import db from "@/db";

export const POST = async (req: Request) => {
  try {
    await db.connect();

    const user = await syncUserFromClerk();

    console.log("Authenticated user:", user);

    return NextResponse.json(
      { message: "User synchronized successfully.", user },
      { status: 200 }
    );
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
