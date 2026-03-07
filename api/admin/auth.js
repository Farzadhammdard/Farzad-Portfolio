import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookie = "farzad_admin_session";
export const adminSessionMaxAgeSeconds = 60 * 60 * 24 * 7;

const defaultAdminSecret = "farzad-portfolio-admin-secret-change-this";

function getAdminSecret() {
  return process.env.PORTFOLIO_ADMIN_SECRET?.trim() || defaultAdminSecret;
}

function createSignature(value) {
  return createHmac("sha256", getAdminSecret()).update(value).digest("base64url");
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value) {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (
      parsed.role !== "admin" ||
      typeof parsed.exp !== "number" ||
      typeof parsed.username !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function createAdminSessionToken(username) {
  const payload = encodePayload({
    role: "admin",
    username,
    exp: Math.floor(Date.now() / 1000) + adminSessionMaxAgeSeconds
  });
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token) {
  if (!token) {
    return null;
  }

  const [payloadSegment, signatureSegment] = token.split(".");
  if (!payloadSegment || !signatureSegment) {
    return null;
  }

  const expectedSignature = createSignature(payloadSegment);
  const providedBuffer = Buffer.from(signatureSegment);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  const payload = decodePayload(payloadSegment);
  if (!payload) {
    return null;
  }

  return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
}

export function getAdminSession() {
  const token = cookies().get(adminSessionCookie)?.value;
  return verifyAdminSessionToken(token);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminSession());
}
