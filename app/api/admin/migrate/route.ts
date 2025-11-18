import path from "path";
import { promises as fs } from "fs";

import { NextResponse } from "next/server";

import { getCollection } from "@/lib/mongo";
import { getUploadsDir, readJsonFromDataOrRepo } from "@/helpers/dataPaths";

const PASSWORD = process.env.ADMIN_PASSWORD || "lead!123";

function isImage(name: string): boolean {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
}

function getMimeType(name: string): string {
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

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir).catch(() => [] as string[]);

    return entries;
  } catch {
    return [] as string[];
  }
}

export async function POST(request: Request) {
  const pwd = request.headers.get("x-admin-password");

  if (pwd !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const configs = await getCollection("configs");
  const imagesCol = await getCollection("images");

  // 1) Migrate configs from repo or volume
  const partners = await readJsonFromDataOrRepo<any[]>(path.join("config", "partners.json"), []);
  const heroes = await readJsonFromDataOrRepo<Record<string, string>>(path.join("config", "heroes.json"), {});
  const srcMap = await readJsonFromDataOrRepo<Record<string, any>>(path.join("config", "srcMap.json"), {});

  await configs.updateOne({ _id: "partners" }, { $set: { data: partners, updatedAt: new Date() } }, { upsert: true });
  await configs.updateOne({ _id: "heroes" }, { $set: { data: heroes, updatedAt: new Date() } }, { upsert: true });
  await configs.updateOne({ _id: "srcMap" }, { $set: { data: srcMap, updatedAt: new Date() } }, { upsert: true });

  // 2) Migrate images from public/uploads and /data/uploads (if present)
  const migrated: string[] = [];
  const skipped: string[] = [];

  const projectRoot = process.cwd();
  const publicUploads = path.join(projectRoot, "public", "uploads");
  const dataUploads = getUploadsDir();
  const sources = [publicUploads, dataUploads];

  for (const srcDir of sources) {
    const files = await readDirSafe(srcDir);

    for (const name of files) {
      if (!isImage(name)) continue;
      try {
        const filePath = path.join(srcDir, name);
        const stat = await fs.stat(filePath).catch(() => null);

        if (!stat || !stat.isFile()) continue;
        const buf = await fs.readFile(filePath);
        const base64 = buf.toString("base64");
        const mimeType = getMimeType(name);

        await imagesCol.updateOne(
          { _id: name },
          { $set: { data: base64, mimeType, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date(), service: null } },
          { upsert: true }
        );
        migrated.push(name);
      } catch {
        skipped.push(name);
      }
    }
  }

  return NextResponse.json({ ok: true, migratedCount: migrated.length, migrated, skipped });
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST to run migration with x-admin-password header" });
}

export async function DELETE(request: Request) {
  const pwd = request.headers.get("x-admin-password");

  if (pwd !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { getDb } = await import("@/lib/mongo");
  const db = await getDb();

  await db.dropDatabase();

  return NextResponse.json({ ok: true, message: "Database dropped" });
}


