import "server-only";

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const adminUsersFilePath = path.join(process.cwd(), "content", "admin-users.json");
const defaultUsername = process.env.PORTFOLIO_ADMIN_USERNAME?.trim().toLowerCase() || "admin";
const defaultPassword = process.env.PORTFOLIO_ADMIN_PASSWORD?.trim() || "123";

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

function normalizeUser(value) {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value;
  const username = typeof record.username === "string" ? normalizeUsername(record.username) : "";
  const passwordHash = typeof record.passwordHash === "string" ? record.passwordHash.trim() : "";

  if (!username || !passwordHash) {
    return null;
  }

  return { username, passwordHash };
}

function getDefaultAdminUsers() {
  return [
    {
      username: defaultUsername,
      passwordHash: hashPassword(defaultPassword)
    }
  ];
}

export async function readAdminUsers() {
  try {
    const content = await fs.readFile(adminUsersFilePath, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return getDefaultAdminUsers();
    }

    const normalized = parsed.map((item) => normalizeUser(item)).filter(Boolean);

    return normalized.length > 0 ? normalized : getDefaultAdminUsers();
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return getDefaultAdminUsers();
    }
    throw error;
  }
}

export async function writeAdminUsers(users) {
  const normalizedUsers = users.map((item) => normalizeUser(item)).filter(Boolean);

  const uniqueUsers = Array.from(new Map(normalizedUsers.map((item) => [item.username, item])).values());

  await fs.mkdir(path.dirname(adminUsersFilePath), { recursive: true });
  await fs.writeFile(adminUsersFilePath, `${JSON.stringify(uniqueUsers, null, 2)}\n`, "utf8");
}

export async function verifyAdminCredentials(username, password) {
  const normalizedUsername = normalizeUsername(username);
  const passwordHash = hashPassword(password);
  const users = await readAdminUsers();

  return users.some(
    (user) => user.username === normalizedUsername && user.passwordHash === passwordHash
  );
}

export async function listAdminUsernames() {
  const users = await readAdminUsers();
  return users.map((user) => user.username);
}

export async function addAdminUser(username, password) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedPassword = password.trim();

  if (!normalizedUsername) {
    throw new Error("Username is required.");
  }
  if (normalizedPassword.length < 3) {
    throw new Error("Password must be at least 3 characters.");
  }

  const users = await readAdminUsers();
  if (users.some((user) => user.username === normalizedUsername)) {
    throw new Error("Username already exists.");
  }

  users.push({
    username: normalizedUsername,
    passwordHash: hashPassword(normalizedPassword)
  });
  await writeAdminUsers(users);

  return users.map((user) => user.username);
}
