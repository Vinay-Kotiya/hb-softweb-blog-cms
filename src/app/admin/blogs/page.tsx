import Link from "next/link";
import { getAllBlogs } from "@/services/blog.service";

// export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create and manage your published content.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Create blog
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        {blogs.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="font-semibold">No blogs found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your first blog to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{blog.title}</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    /blog/{blog.slug}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {blog.excerpt}
                  </p>
                </div>

                <Link
                  href={`/admin/blogs/${blog.id}/edit`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">Total blogs: {blogs.length}</p>
    </main>
  );
}
