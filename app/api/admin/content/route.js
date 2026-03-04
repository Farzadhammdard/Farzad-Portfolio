import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/api/admin/auth";
import { readSiteContent, writeSiteContent } from "@/api/content-store";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const content = await readSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("[admin/content] get failed", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const current = await readSiteContent();

    const nextContent = {
      projects: Array.isArray(body.projects) ? body.projects : current.projects,
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : current.galleryImages,
      updatedAt: current.updatedAt
    };

    const savedContent = await writeSiteContent(nextContent);
    return NextResponse.json(savedContent);
  } catch (error) {
    console.error("[admin/content] save failed", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
