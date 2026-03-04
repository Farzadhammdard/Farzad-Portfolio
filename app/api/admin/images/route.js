import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/api/admin/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const maxImageSizeBytes = 8 * 1024 * 1024;

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "gallery",
      resource_type: "image",
    });

    const images = result.resources.map((resource) => ({
      name: resource.public_id.split("/").pop(),
      src: resource.secure_url,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("[admin/images] failed to fetch from Cloudinary", error);
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

    const extension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.has(extension)) {
      return NextResponse.json({ error: "Unsupported image format." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "gallery",
      resource_type: "image",
    });

    return NextResponse.json({
      ok: true,
      image: {
        name: uploadResult.public_id.split("/").pop(),
        src: uploadResult.secure_url,
      },
    });
  } catch (error) {
    console.error("[admin/images] upload failed", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}

