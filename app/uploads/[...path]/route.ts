import { NextResponse } from "next/server";

import { getCollection } from "@/lib/mongo";

function resolveUploaderBase(): string {
  const raw = (process.env.UPLOADER_URL || process.env.NEXT_PUBLIC_UPLOADER_URL || "").trim();

  if (!raw) return "";

  return raw.replace(/\/+$/, "");
}

function computeRemoteUrl(doc: any, uploaderBase: string, fallbackName: string): string {
  const storedUrl = typeof doc?.url === "string" ? doc.url.trim() : "";

  if (storedUrl) {
    if (/^https?:\/\//i.test(storedUrl) || storedUrl.startsWith("/")) {
      return storedUrl;
    }
    if (uploaderBase) {
      return `${uploaderBase}/${storedUrl.replace(/^\/+/, "")}`;
    }
  }

  const storedPath = typeof doc?.path === "string" ? doc.path.trim() : "";

  if (storedPath && uploaderBase) {
    const normalized = storedPath.replace(/^\/+/, "").replace(/^files\//i, "");

    return `${uploaderBase}/files/${normalized}`;
  }

  if (uploaderBase && doc?.service === "php-uploader") {
    return `${uploaderBase}/files/${fallbackName}`;
  }

  return "";
}

export async function GET(_req: Request, { params }: any) {
  const pathParam = (params?.path as string[] | undefined) || [];

  if (pathParam.length !== 1) return new NextResponse("Not found", { status: 404 });
  const name = pathParam[0];

  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });

  const images = await getCollection("images");
  const doc = await images.findOne<{ _id: string; data?: string; mimeType?: string; url?: string; path?: string; service?: string }>(
    { _id: name },
    { projection: { data: 1, mimeType: 1, url: 1, path: 1, service: 1 } as any }
  );

  if (!doc) return new NextResponse("Not found", { status: 404 });

  const base64 = typeof doc.data === "string" ? doc.data : "";

  if (base64) {
    const bytes = Buffer.from(base64, "base64");

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  }

  const uploaderBase = resolveUploaderBase();
  const remoteUrl = computeRemoteUrl(doc, uploaderBase, name);

  if (remoteUrl) {
    return NextResponse.redirect(remoteUrl, { status: 302 });
  }

  return new NextResponse("Not found", { status: 404 });
}

