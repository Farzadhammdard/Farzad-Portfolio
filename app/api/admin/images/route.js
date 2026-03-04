import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/api/admin/auth";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const maxImageSizeBytes = 8 * 1024 * 1024;

function sanitizeFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, extension).toLowerCase();
  const safeBaseName = baseName.replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  const fallbackBaseName = safeBaseName || "image";
  return { extension, baseName: fallbackBaseName };
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const galleryPath = path.join(process.cwd(), "public", "gallery");
    await fs.mkdir(galleryPath, { recursive: true });
    const files = await fs.readdir(galleryPath, { withFileTypes: true });

    const images = files
      .filter((file) => file.isFile())
      .filter((file) => allowedExtensions.has(path.extname(file.name).toLowerCase()))
      .map((file) => ({
        name: file.name,
        src: `/gallery/${encodeURI(file.name)}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("[admin/images] failed", error);
    return NextResponse.json({ error: "Failed to load image list" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (file.size > maxImageSizeBytes) {
      return NextResponse.json({ error: "Image is too large. Max size is 8MB." }, { status: 400 });
    }

    const { extension, baseName } = sanitizeFileName(file.name);
    if (!allowedExtensions.has(extension)) {
      return NextResponse.json({ error: "Unsupported image format." }, { status: 400 });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${baseName}${extension}`;
    const galleryPath = path.join(process.cwd(), "public", "gallery");
    const destinationPath = path.join(galleryPath, fileName);

    const bytes = await file.arrayBuffer();
    await fs.mkdir(galleryPath, { recursive: true });
    await fs.writeFile(destinationPath, Buffer.from(bytes));

    return NextResponse.json({
      ok: true,
      image: {
        name: fileName,
        src: `/gallery/${encodeURI(fileName)}`
      }
    });
  } catch (error) {
    console.error("[admin/images] upload failed", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
