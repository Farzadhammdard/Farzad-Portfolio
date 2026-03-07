import { BlogPageContent } from "@/components/blog/blog-page-content";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Notes and technical articles"
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogPageContent posts={posts} />;
}
