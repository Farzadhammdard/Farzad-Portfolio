import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";

/**
 * Generic JSON read/write for small config-style documents (site content,
 * admin users). Next.js deployments on Vercel ship a read-only filesystem
 * (aside from /tmp, which is ephemeral per-instance), so plain fs.writeFile
 * calls silently stop persisting once deployed — edits made from the admin
 * panel would disappear on the next cold start/deploy. When
 * BLOB_READ_WRITE_TOKEN is present (set automatically once a Vercel Blob
 * store is connected to the project) we use Vercel Blob instead, at a fixed
 * pathname with allowOverwrite so we don't accumulate old versions. Locally,
 * without that token, we keep writing to the filesystem so `npm run dev`
 * still works with zero extra setup.
 */

const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function blobPathFor(fileName) {
  return `store/${fileName}`;
}

async function readLocalFile(fileName) {
  const filePath = path.join(process.cwd(), "content", fileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function writeLocalFile(fileName, value) {
  const filePath = path.join(process.cwd(), "content", fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function blobBaseUrl() {
  // Public Vercel Blob URLs follow https://<store-id>.public.blob.vercel-storage.com/<pathname>
  // BLOB_READ_WRITE_TOKEN encodes the store id, so we derive the base once here.
  const token = process.env.BLOB_READ_WRITE_TOKEN || "";
  const match = token.match(/^vercel_blob_rw_([a-z0-9]+)_/i);
  const storeId = match ? match[1].toLowerCase() : null;
  return storeId ? `https://${storeId}.public.blob.vercel-storage.com` : null;
}

async function readBlobFile(fileName) {
  const base = blobBaseUrl();
  if (!base) {
    return null;
  }

  const response = await fetch(`${base}/${blobPathFor(fileName)}`, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

async function writeBlobFile(fileName, value) {
  await put(blobPathFor(fileName), JSON.stringify(value, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true
  });
}

export async function readJsonDocument(fileName) {
  return hasBlob ? readBlobFile(fileName) : readLocalFile(fileName);
}

export async function writeJsonDocument(fileName, value) {
  await (hasBlob ? writeBlobFile(fileName, value) : writeLocalFile(fileName, value));
  return value;
}

export function isUsingBlobStorage() {
  return hasBlob;
}
