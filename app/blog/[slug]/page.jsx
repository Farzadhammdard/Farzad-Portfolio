import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

const mdxComponents = {
  h2: (props) => <h2 className="mt-10 text-2xl font-semibold text-white" {...props} />,
  h3: (props) => <h3 className="mt-7 text-xl font-semibold text-white" {...props} />,
  p: (props) => <p className="mt-4 text-sm leading-7 text-slate-300" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-1 pl-6 text-slate-300" {...props} />,
  code: (props) => <code className="rounded bg-white/10 px-1 py-0.5 text-sm text-sky-100" {...props} />,
  pre: (props) => <pre className="mt-4 overflow-x-auto rounded-xl bg-[#030915] p-4" {...props} />
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs text-sky-200">{post.date}</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{post.title}</h1>
        <p className="mt-3 text-slate-300">{post.excerpt}</p>
        <div className="mt-8">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
