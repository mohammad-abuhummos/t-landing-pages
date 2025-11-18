import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";

const PASSWORD = process.env.ADMIN_PASSWORD || "lead!123";

function getMimeTypeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "webp": return "image/webp";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    default: return "application/octet-stream";
  }
}

export async function GET() {
  const images = await getCollection("images");
  const cursor = images.find({}, { projection: { _id: 1, url: 1, service: 1 } as any });
  const payload: Array<{ name: string; url: string; service?: string | null }> = [];
  for await (const doc of cursor) {
    const name = doc._id as string;
    const service = (doc as any).service ?? null;
    const url = (doc as any).url || `/uploads/${name}`; // prefer external URL if present, else fallback to legacy
    payload.push({ name, url, service });
  }
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const pwd = request.headers.get("x-admin-password");
  if (pwd !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const desiredName = ((form.get("name") as string) || "").trim();
  const dirFromForm = ((form.get("dir") as string) || "").trim();
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  // Forward upload to external PHP uploader
  const UPLOADER_URL = (process.env.UPLOADER_URL || process.env.NEXT_PUBLIC_UPLOADER_URL || "").replace(/\/$/, "");
  const UPLOADER_DIR = process.env.UPLOADER_DIR || dirFromForm || "images";
  if (!UPLOADER_URL) {
    return NextResponse.json({ error: "Uploader not configured (set UPLOADER_URL)" }, { status: 500 });
  }

  const proxyForm = new FormData();
  proxyForm.append("file", file, file.name || "upload");
  if (UPLOADER_DIR) proxyForm.append("dir", UPLOADER_DIR);

  const upstream = await fetch(UPLOADER_URL + "/", {
    method: "POST",
    body: proxyForm,
    // No headers: FormData sets its own Content-Type with boundary
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json({ error: "Uploader failed", details: text }, { status: 502 });
  }

  const upstreamJson: any = await upstream.json().catch(() => null);
  if (!upstreamJson || typeof upstreamJson.url !== "string") {
    return NextResponse.json({ error: "Invalid uploader response" }, { status: 502 });
  }

  const externalUrl: string = upstreamJson.url;
  const fallbackName = upstreamJson.filename || file.name || `upload_${Date.now()}`;
  const safeName = (desiredName || fallbackName).replace(/[^a-zA-Z0-9._-]/g, "_");

  const images = await getCollection("images");
  await images.updateOne(
    { _id: safeName },
    { $set: { service: "php-uploader", url: externalUrl, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, name: safeName, url: externalUrl });
}

export async function DELETE(request: Request) {
  const pwd = request.headers.get("x-admin-password");
  if (pwd !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null as any);
  const name = (body?.name as string) || "";
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const images = await getCollection("images");
  await images.deleteOne({ _id: name });
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const pwd = request.headers.get("x-admin-password");
  if (pwd !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null as any);
  const oldName = (body?.oldName as string) || "";
  const newNameRaw = (body?.newName as string) || "";
  const newName = newNameRaw.replace(/[^a-zA-Z0-9._-]/g, "_");
  if (!oldName || !newName) return NextResponse.json({ error: "Missing oldName/newName" }, { status: 400 });
  const images = await getCollection("images");
  const existing = await images.findOne({ _id: oldName });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Prevent overwrite
  const conflict = await images.findOne({ _id: newName });
  if (conflict) return NextResponse.json({ error: "Target name already exists" }, { status: 409 });
  await images.insertOne({ ...existing, _id: newName, updatedAt: new Date() });
  await images.deleteOne({ _id: oldName });
  const existingUrl = (existing as any)?.url as string | undefined;
  return NextResponse.json({ ok: true, name: newName, url: existingUrl || `/uploads/${newName}` });
}


