import db from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.connect();

    await db.disconnect();

    return NextResponse.json({ message: 'Seeding successful' }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Error seeding database' }, { status: 500 });
  }
}