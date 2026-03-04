import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { galleryImages as defaultGalleryImages, projects as defaultProjects } from "@/lib/site-data";

const contentFilePath = path.join(process.cwd(), "content", "site-content.json");

function asString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeStack(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeProject(value, index) {
  const record = typeof value === "object" && value !== null ? value : {};

  return {
    id: asString(record.id, `project-${index + 1}`),
    title: asString(record.title, `Project ${index + 1}`),
    description: asString(record.description),
    image: asString(record.image),
    stack: normalizeStack(record.stack)
  };
}

function normalizeGalleryItem(value, index) {
  const record = typeof value === "object" && value !== null ? value : {};

  return {
    id: asString(record.id, `gallery-${index + 1}`),
    title: asString(record.title, `Gallery ${index + 1}`),
    src: asString(record.src)
  };
}

function getDefaultContent() {
  return {
    projects: defaultProjects.map((project, index) => normalizeProject(project, index)),
    galleryImages: defaultGalleryImages.map((item, index) => normalizeGalleryItem(item, index)),
    updatedAt: new Date().toISOString()
  };
}

function normalizeSiteContent(value) {
  const record = typeof value === "object" && value !== null ? value : {};
  const projectsInput = Array.isArray(record.projects) ? record.projects : [];
  const galleryInput = Array.isArray(record.galleryImages) ? record.galleryImages : [];

  const normalized = {
    projects: projectsInput.map((project, index) => normalizeProject(project, index)),
    galleryImages: galleryInput.map((item, index) => normalizeGalleryItem(item, index)),
    updatedAt: asString(record.updatedAt, new Date().toISOString())
  };

  if (normalized.projects.length === 0 || normalized.galleryImages.length === 0) {
    const defaults = getDefaultContent();
    return {
      projects: normalized.projects.length > 0 ? normalized.projects : defaults.projects,
      galleryImages: normalized.galleryImages.length > 0 ? normalized.galleryImages : defaults.galleryImages,
      updatedAt: normalized.updatedAt
    };
  }

  return normalized;
}

export async function readSiteContent() {
  try {
    const content = await fs.readFile(contentFilePath, "utf8");
    return normalizeSiteContent(JSON.parse(content));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return getDefaultContent();
    }
    throw error;
  }
}

export async function writeSiteContent(value) {
  const normalizedContent = normalizeSiteContent({
    ...value,
    updatedAt: new Date().toISOString()
  });

  await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
  await fs.writeFile(contentFilePath, `${JSON.stringify(normalizedContent, null, 2)}\n`, "utf8");

  return normalizedContent;
}
