import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "blog");

function parseMeta(fileName, source) {
  const { data } = matter(source);
  const slug = fileName.replace(/\.mdx$/, "");

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? "2026-01-01"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : []
  };
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));

  return files
    .map((file) => {
      const fullPath = path.join(postsDirectory, file);
      const source = fs.readFileSync(fullPath, "utf8");
      return parseMeta(file, source);
    })
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
}

export function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(source);
  const meta = parseMeta(`${slug}.mdx`, source);

  return {
    ...meta,
    content
  };
}
