"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Globe,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
};

type BlogManagementProps = {
  blogs: Blog[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogManagement({ blogs }: BlogManagementProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.slug.toLowerCase().includes(query),
    );
  }, [blogs, search]);

  async function handleDelete(blog: Blog) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(blog.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete blog.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the blog.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Dashboard header */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="editorial-kicker mb-2">CONTENT MANAGEMENT</p>

          <h1 className="font-editorial text-4xl tracking-tight md:text-5xl">
            Your articles.
          </h1>

          <p className="mt-3 text-sm text-[#777970]">
            Create, organize and manage your published stories.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#20231f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a77b45]"
        >
          <Plus size={17} />
          Create new article
        </Link>
      </div>

      {/* Overview cards */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e8e6df] bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#777970]">
              Total articles
            </span>

            <BookOpen size={19} className="text-[#a77b45]" />
          </div>

          <p className="mt-4 font-editorial text-4xl">{blogs.length}</p>

          <p className="mt-2 text-xs text-[#99998f]">
            Articles stored in your database
          </p>
        </div>

        <div className="rounded-2xl border border-[#e8e6df] bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#777970]">
              Publishing status
            </span>

            <Globe size={19} className="text-emerald-600" />
          </div>

          <p className="mt-4 font-editorial text-4xl">Live</p>

          <p className="mt-2 text-xs text-[#99998f]">
            All saved articles are publicly accessible
          </p>
        </div>
      </div>

      {/* Content management panel */}

      <section className="overflow-hidden rounded-2xl border border-[#e8e6df] bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-[#e8e6df] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-editorial text-2xl">Content library</h2>

            <p className="mt-1 text-xs text-[#85857c]">
              {filteredBlogs.length} of {blogs.length} articles
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99998f]"
            />

            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-[#e8e6df] bg-[#f8f7f4] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#a77b45]"
            />
          </div>
        </div>

        {/* Error message */}

        {error && (
          <div
            role="alert"
            className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Empty state */}

        {blogs.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#f0eee8]">
              <FileText size={27} className="text-[#a77b45]" />
            </div>

            <h3 className="font-editorial mt-6 text-3xl">
              Your library is waiting.
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#777970]">
              You haven't created any articles yet. Start writing your first
              story.
            </p>

            <Link
              href="/admin/blogs/new"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#20231f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a77b45]"
            >
              <Plus size={16} />
              Create your first article
            </Link>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Search size={26} className="mx-auto text-[#a77b45]" />

            <h3 className="font-editorial mt-4 text-2xl">
              No matching articles.
            </h3>

            <p className="mt-2 text-sm text-[#777970]">
              Try another title or slug.
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-5 text-sm font-semibold text-[#a77b45] underline underline-offset-4"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#eeeae3]">
            {filteredBlogs.map((blog) => {
              const isDeleting = deletingId === blog.id;

              return (
                <article
                  key={blog.id}
                  className={`group flex flex-col gap-5 p-5 transition hover:bg-[#faf9f6] sm:p-6 lg:flex-row lg:items-center lg:justify-between ${
                    isDeleting ? "opacity-60" : ""
                  }`}
                >
                  {/* Article information */}

                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-[#f0eee8] sm:flex">
                      <FileText size={21} className="text-[#a77b45]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-editorial text-xl leading-snug">
                          {blog.title}
                        </h3>

                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Live
                        </span>
                      </div>

                      <p className="mt-2 truncate text-xs text-[#a77b45]">
                        /blog/{blog.slug}
                      </p>

                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-[#777970]">
                        {blog.excerpt}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-[#99998f]">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          Created {formatDate(blog.createdAt)}
                        </span>

                        <span>Updated {formatDate(blog.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Article actions */}

                  <div className="flex shrink-0 items-center gap-2 border-t border-[#eeeae3] pt-4 lg:border-0 lg:pt-0">
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Preview ${blog.title}`}
                      title="Preview article"
                      className="flex items-center gap-2 rounded-full border border-[#e8e6df] px-3 py-2.5 text-xs font-medium transition hover:border-[#a77b45] hover:bg-[#f8f7f4]"
                    >
                      Preview
                      <ArrowUpRight size={14} />
                    </Link>

                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      aria-label={`Edit ${blog.title}`}
                      title="Edit article"
                      className="flex size-10 items-center justify-center rounded-full border border-[#e8e6df] transition hover:border-[#a77b45] hover:bg-[#f0eee8]"
                    >
                      <Pencil size={15} />
                    </Link>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(blog)}
                      aria-label={`Delete ${blog.title}`}
                      title="Delete article"
                      className="flex size-10 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer */}

        {blogs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e6df] bg-[#faf9f6] px-6 py-4">
            <p className="text-xs text-[#85857c]">
              Showing {filteredBlogs.length} articles
            </p>

            <Link
              href="/blog"
              target="_blank"
              className="flex items-center gap-2 text-xs font-semibold text-[#a77b45] hover:underline"
            >
              View public website
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
