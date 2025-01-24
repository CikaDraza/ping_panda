import { NextResponse } from "next/server";
import db from "@/db";
import { syncUserFromClerk } from "@/server/services/userService";

export async function POST(request: Request) {
  try {
    await db.connect();

    const user = await syncUserFromClerk();

    return NextResponse.json(
      { message: "User successfully synchronized.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { message: error || "Internal server error." },
      { status: 500 }
    );
  } finally {
    db.disconnect();
  }
}
