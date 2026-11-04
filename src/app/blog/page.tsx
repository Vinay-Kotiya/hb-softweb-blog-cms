import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays } from "lucide-react";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Journal | Latest Articles & Insights",
  description:
    "Explore our latest articles, ideas, insights, and stories from our journal.",
};

type JsonNode = {
  type?: string;
  text?: string;
  content?: JsonNode[];
};

type BlogItem = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  createdAt: Date;
};

function BlogListFallback() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div className="h-10 w-56 animate-pulse rounded bg-gray-200" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    </main>
  );
}

/**
 * Extract readable text from Tiptap JSON.
 * Formatting nodes are traversed recursively.
 */
function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  if (Array.isArray(node)) {
    return node.map(extractText).join(" ");
  }

  const value = node as JsonNode;

  if (value.type === "text") {
    return value.text ?? "";
  }

  return (value.content ?? []).map(extractText).filter(Boolean).join(" ");
}

/**
 * Generate a clean excerpt without breaking words.
 */
function createExcerpt(content: unknown, maxLength = 150): string {
  const text = extractText(content).replace(/\s+/g, " ").trim();

  if (!text) return "Discover more in this article.";

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
}

function getReadingTime(content: unknown): number {
  const text = extractText(content).trim();
  const words = text ? text.split(/\s+/).length : 0;

  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function getBlogs(): Promise<BlogItem[]> {
  return prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      createdAt: true,
    },
  });
}

async function BlogListContent() {
  // Ensures this page reads the latest database content per request.
  await connection();

  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#252620]">
      {/* Navigation */}
      <header className="border-b border-[#eae7df]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-tight text-[#292a24]"
          >
            Storyline<span className="text-[#b58a56]">.</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-[#777970]">
            <Link href="/" className="transition hover:text-[#a77b45]">
              Home
            </Link>
            <Link href="/blog" className="text-[#a77b45]" aria-current="page">
              Journal
            </Link>
          </nav>
        </div>
      </header>

      {/* Editorial Hero */}
      <section className="relative overflow-hidden border-b border-[#eae7df] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-[#e8dfd0] opacity-60" />
        <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full border border-[#e8dfd0] opacity-60" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#a77b45]">
            <span className="h-px w-9 bg-[#b58a56]" />
            Ideas worth sharing
          </div>

          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl font-medium leading-[1.08] tracking-tight text-[#252620] sm:text-6xl lg:text-7xl">
                Thoughts, ideas
                <br />
                <span className="italic text-[#a77b45]">
                  &amp; perspectives.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#777970] sm:text-lg">
                A collection of insights, stories, and ideas to inspire
                curiosity, encourage fresh thinking, and help you see things
                differently.
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-[#e3ded4] pt-5 lg:min-w-48 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="font-serif text-4xl text-[#a77b45]">
                  {String(blogs.length).padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#89877e]">
                  Published articles
                </p>
              </div>
              <BookOpen
                size={23}
                strokeWidth={1.2}
                className="text-[#b58a56]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#e7e3da] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a77b45]">
                The collection
              </p>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[#252620] sm:text-4xl">
                Latest articles
              </h2>
            </div>

            <p className="text-sm text-[#89877e]">
              Showing {blogs.length}{" "}
              {blogs.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => {
                const excerpt = createExcerpt(blog.content);
                const readingTime = getReadingTime(blog.content);

                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${encodeURIComponent(blog.slug)}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#eae6de] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#d8c4a8] hover:shadow-[0_18px_45px_rgba(43,39,30,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a77b45] focus-visible:ring-offset-4"
                    aria-label={`Read article: ${blog.title}`}
                  >
                    {/* Card Top */}
                    <div className="relative flex h-48 items-center justify-between overflow-hidden border-b border-[#eeeae2] bg-[#f3f0e9] px-7">
                      <span className="font-serif text-7xl font-medium text-[#e3d9c9] transition duration-500 group-hover:scale-110 group-hover:text-[#d7c5aa]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="absolute right-7 top-7 flex h-10 w-10 items-center justify-center rounded-full border border-[#dfd5c6] text-[#a77b45] transition duration-300 group-hover:border-[#a77b45] group-hover:bg-[#a77b45] group-hover:text-white">
                        <ArrowUpRight size={18} />
                      </div>

                      <div className="absolute bottom-6 right-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a79a86]">
                        Journal / Article
                      </div>

                      <div className="absolute bottom-0 left-7 h-[2px] w-10 bg-[#b58a56] transition-all duration-500 group-hover:w-20" />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#89877e]">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-[#a77b45]" />
                          {formatDate(blog.createdAt)}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#c7bba9]" />

                        <span>{readingTime} min read</span>
                      </div>

                      <h3 className="mb-4 line-clamp-2 font-serif text-2xl font-medium leading-snug tracking-tight text-[#292a24] transition-colors group-hover:text-[#a77b45]">
                        {blog.title}
                      </h3>

                      <p className="mb-7 line-clamp-3 flex-1 text-sm leading-7 text-[#777970]">
                        {excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-[#eeeae2] pt-5">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a77b45]">
                          Read article
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f2ec] text-[#a77b45] transition duration-300 group-hover:translate-x-1 group-hover:bg-[#a77b45] group-hover:text-white">
                          <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#dcd5c9] bg-white px-6 py-20 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f2ec] text-[#a77b45]">
                <BookOpen size={27} strokeWidth={1.3} />
              </div>

              <h3 className="font-serif text-2xl font-medium text-[#292a24]">
                Nothing here just yet.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#89877e]">
                We&apos;re working on something worth reading. Check back soon
                for fresh articles and ideas.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#a77b45] transition hover:text-[#805a31]"
              >
                Back to home <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#eae7df] bg-[#f2efe8] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a77b45]">
              Keep exploring
            </p>
            <h2 className="font-serif text-3xl font-medium text-[#292a24]">
              There&apos;s always more to discover.
            </h2>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3 rounded-full bg-[#292a24] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#a77b45]"
          >
            Explore homepage
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eae7df] px-5 py-7 text-center text-xs tracking-wide text-[#99958a] sm:px-8">
        © {new Date().getFullYear()} Storyline. All rights reserved.
      </footer>
    </main>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogListFallback />}>
      <BlogListContent />
    </Suspense>
  );
}
