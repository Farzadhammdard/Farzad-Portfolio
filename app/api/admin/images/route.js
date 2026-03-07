import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdminAuthenticated } from "@/api/admin/auth";

export const runtime = "nodejs";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const mimeByExtension = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif"
};
const maxImageSizeBytes = 4 * 1024 * 1024;
const cloudinaryFolder = "gallery";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

function cloudinaryConfigErrorResponse() {
  return NextResponse.json(
    {
      error_code: "cloudinary_not_configured",
      error:
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel environment variables."
    },
    { status: 500 }
  );
}

function getExtension(fileName) {
  const safeName = String(fileName || "");
  const dotIndex = safeName.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === safeName.length - 1) {
    return "";
  }
  return safeName.slice(dotIndex).toLowerCase();
}

function isFileLike(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.name === "string" &&
      typeof value.size === "number" &&
      typeof value.arrayBuffer === "function"
  );
}

function getErrorMessage(error, fallback) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET() {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({
      images: [],
      warning_code: "cloudinary_not_configured",
      warning:
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    });
  }

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: cloudinaryFolder,
      resource_type: "image"
    });

    const images = result.resources.map((resource) => ({
      name: resource.public_id.split("/").pop(),
      src: resource.secure_url
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("[admin/images] failed to fetch from Cloudinary", error);
    return NextResponse.json({ error: getErrorMessage(error, "Failed to load image list.") }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  if (!isCloudinaryConfigured()) {
    return cloudinaryConfigErrorResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!isFileLike(file)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (file.size > maxImageSizeBytes) {
      return NextResponse.json(
        {
          error: "Image is too large. Max size is 4MB."
        },
        { status: 400 }
      );
    }

    const extension = getExtension(file.name);
    if (!allowedExtensions.has(extension)) {
      return NextResponse.json({ error: "Unsupported image format." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || mimeByExtension[extension] || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: cloudinaryFolder,
      resource_type: "image"
    });

    return NextResponse.json({
      ok: true,
      image: {
        name: uploadResult.public_id.split("/").pop(),
        src: uploadResult.secure_url
      }
    });
  } catch (error) {
    console.error("[admin/images] upload failed", error);
    return NextResponse.json({ error: getErrorMessage(error, "Failed to upload image.") }, { status: 500 });
  }
}
