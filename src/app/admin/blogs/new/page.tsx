import BlogForm from "@/components/admin/blog-form";
import Link from "next/link";

export default function NewBlogPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-10">
      <Link
        href="/admin/blogs"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to blogs
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Create a new blog</h1>
        <p className="mt-2 text-slate-500">
          Write, format and publish your blog content.
        </p>
      </div>

      <BlogForm />
    </main>
  );
}
