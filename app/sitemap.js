import { getAllPosts } from "@/lib/posts";

export default function sitemap() {
  const baseUrl = "https://farzad-portfolio.vercel.app";
  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date)
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...posts
  ];
}
