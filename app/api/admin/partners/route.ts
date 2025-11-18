import { NextResponse } from "next/server";

import { getCollection } from "@/lib/mongo";

const PASSWORD = process.env.ADMIN_PASSWORD || "lead!123";

type Partner = { name: string; url?: string };

export async function GET() {
  const configs = await getCollection<{ _id: string; data: Partner[] }>("configs");
  const doc = await configs.findOne({ _id: "partners" });
  const data = Array.isArray(doc?.data) ? doc!.data : [];

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const pwd = request.headers.get("x-admin-password");

  if (pwd !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (!Array.isArray(body)) return NextResponse.json({ error: "Body must be an array" }, { status: 400 });

    const normalized: Partner[] = body.map((item: any) => {
      if (typeof item === "string") return { name: item, url: "" };
      if (item && typeof item.name === "string") return { name: item.name, url: typeof item.url === "string" ? item.url : "" };
      throw new Error("Invalid partner entry");
    });

    if (!normalized.every((p) => typeof p.name === "string")) {
      return NextResponse.json({ error: "Each partner must have a name" }, { status: 400 });
    }

    const configs = await getCollection("configs");

    await configs.updateOne(
      { _id: "partners" },
      { $set: { data: normalized, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid JSON" }, { status: 400 });
  }
}


