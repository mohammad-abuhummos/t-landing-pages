import { NextResponse } from "next/server";

import { getCollection } from "@/lib/mongo";

const PASSWORD = process.env.ADMIN_PASSWORD || "lead!123";

export async function GET() {
  const configs = await getCollection<{ _id: string; data: Record<string, any> }>("configs");
  const doc = await configs.findOne({ _id: "srcMap" });

  return NextResponse.json(doc?.data || {});
}

export async function PUT(request: Request) {
  const pwd = request.headers.get("x-admin-password");

  if (pwd !== PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
    }
    const configs = await getCollection("configs");

    await configs.updateOne(
      { _id: "srcMap" },
      { $set: { data: body, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid JSON" }, { status: 400 });
  }
}


