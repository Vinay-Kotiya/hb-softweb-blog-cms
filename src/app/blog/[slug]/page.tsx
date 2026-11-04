import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

type TiptapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: TiptapMark[];
  content?: TiptapNode[];
};

type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getBlog(slug: string): Promise<BlogRecord | null> {
  return prisma.blog.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

function getPlainText(node: TiptapNode): string {
  if (node.type === "text") return node.text ?? "";

  return (node.content ?? []).map(getPlainText).join(" ");
}

function getReadingTime(content: TiptapNode): number {
  const words = getPlainText(content)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Allow only safe URL protocols.
 * Relative paths and hash links are also supported.
 */
function safeHref(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const href = value.trim();

  if (!href || href.startsWith("//")) return null;

  if (href.startsWith("/") || href.startsWith("#")) {
    return href;
  }

  try {
    const url = new URL(href);

    if (
      url.protocol === "https:" ||
      url.protocol === "http:" ||
      url.protocol === "mailto:" ||
      url.protocol === "tel:"
    ) {
      return href;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Restrict inline colors to common CSS color formats.
 * This prevents arbitrary CSS values from being rendered.
 */
function safeColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const color = value.trim();

  const isHex = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color);
  const isRgb = /^rgba?\(\s*[\d.%\s,]+\)$/i.test(color);
  const isHsl = /^hsla?\(\s*[\d.%\s,deg]+\)$/i.test(color);

  return isHex || isRgb || isHsl ? color : undefined;
}

function renderMarks(text: ReactNode, marks: TiptapMark[] = []): ReactNode {
  return marks.reduceRight<ReactNode>((child, mark) => {
    const attrs = mark.attrs ?? {};

    switch (mark.type) {
      case "bold":
        return (
          <strong className="font-semibold text-[#252620]">{child}</strong>
        );

      case "italic":
        return <em>{child}</em>;

      case "underline":
        return <u className="underline underline-offset-4">{child}</u>;

      case "strike":
        return <s>{child}</s>;

      case "code":
        return (
          <code className="rounded bg-[#efede8] px-1.5 py-0.5 font-mono text-[0.9em] text-[#9a6337]">
            {child}
          </code>
        );

      case "textStyle": {
        const color = safeColor(attrs.color);

        return color ? <span style={{ color }}>{child}</span> : child;
      }

      case "highlight": {
        const color = safeColor(attrs.color) ?? "#fff0b8";

        return (
          <mark className="rounded px-1" style={{ backgroundColor: color }}>
            {child}
          </mark>
        );
      }

      case "link": {
        const href = safeHref(attrs.href);
        if (!href) return child;

        const target = attrs.target === "_blank" ? "_blank" : "_self";

        return (
          <a
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="font-medium text-[#a77b45] underline decoration-[#d8c3a5] underline-offset-4 transition hover:text-[#805a31]"
          >
            {child}
          </a>
        );
      }

      default:
        return child;
    }
  }, text);
}

/**
 * Render Tiptap JSON using React elements instead of raw HTML.
 */
function renderNode(node: TiptapNode, index: number): ReactNode {
  const attrs = node.attrs ?? {};
  const children = (node.content ?? []).map((child, childIndex) =>
    renderNode(child, childIndex),
  );

  switch (node.type) {
    case "doc":
      return <div key={index}>{children}</div>;

    case "text":
      return (
        <span key={index}>{renderMarks(node.text ?? "", node.marks)}</span>
      );

    case "paragraph":
      return (
        <p
          key={index}
          className="mb-6 text-[16px] leading-[1.95] text-[#55564f] sm:text-[17px]"
        >
          {children}
        </p>
      );

    case "heading": {
      const level = Number(attrs.level ?? 2);
      const headingClasses: Record<number, string> = {
        1: "mb-7 mt-12 text-4xl font-semibold leading-tight tracking-tight text-[#252620] sm:text-5xl",
        2: "mb-6 mt-11 text-3xl font-semibold leading-tight tracking-tight text-[#252620] sm:text-4xl",
        3: "mb-5 mt-9 text-2xl font-semibold leading-snug text-[#252620] sm:text-3xl",
        4: "mb-4 mt-8 text-xl font-semibold leading-snug text-[#252620] sm:text-2xl",
        5: "mb-4 mt-7 text-lg font-semibold text-[#252620] sm:text-xl",
        6: "mb-3 mt-6 text-base font-semibold text-[#252620] sm:text-lg",
      };

      const Tag = `h${Math.min(6, Math.max(1, level))}` as
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";

      return (
        <Tag key={index} className={headingClasses[level] ?? headingClasses[2]}>
          {children}
        </Tag>
      );
    }

    case "bulletList":
      return (
        <ul
          key={index}
          className="mb-7 ml-6 list-disc space-y-3 text-[16px] leading-[1.9] text-[#55564f] marker:text-[#a77b45] sm:text-[17px]"
        >
          {children}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={index}
          className="mb-7 ml-6 list-decimal space-y-3 text-[16px] leading-[1.9] text-[#55564f] marker:font-semibold marker:text-[#a77b45] sm:text-[17px]"
        >
          {children}
        </ol>
      );

    case "listItem":
      return (
        <li key={index} className="pl-1">
          {children}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="my-9 border-l-[3px] border-[#b58a56] bg-[#f8f5ef] px-6 py-5 text-lg italic leading-relaxed text-[#55564f] sm:px-8 sm:text-xl"
        >
          {children}
        </blockquote>
      );

    case "codeBlock": {
      const language =
        typeof attrs.language === "string" &&
        /^[a-z0-9+#-]+$/i.test(attrs.language)
          ? attrs.language
          : undefined;

      return (
        <pre
          key={index}
          className="my-8 overflow-x-auto rounded-xl bg-[#242520] p-5 text-sm leading-7 text-[#eee9df] sm:p-7"
        >
          <code className={language ? `language-${language}` : undefined}>
            {getPlainText(node)}
          </code>
        </pre>
      );
    }

    case "hardBreak":
      return <br key={index} />;

    case "horizontalRule":
      return <hr key={index} className="my-10 border-[#e9e5dc]" />;

    case "image": {
      const src = safeHref(attrs.src);
      if (!src) return null;

      return (
        <figure key={index} className="my-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={typeof attrs.alt === "string" ? attrs.alt : ""}
            className="h-auto w-full rounded-xl border border-[#e9e5dc] object-cover"
            loading="lazy"
          />
          {typeof attrs.title === "string" && attrs.title ? (
            <figcaption className="mt-3 text-center text-sm text-[#89877e]">
              {attrs.title}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "table":
      return (
        <div key={index} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>{children}</tbody>
          </table>
        </div>
      );

    case "tableRow":
      return (
        <tr key={index} className="border-b border-[#e9e5dc]">
          {children}
        </tr>
      );

    case "tableHeader":
      return (
        <th
          key={index}
          className="bg-[#f3f0e9] px-4 py-3 font-semibold text-[#33342e]"
        >
          {children}
        </th>
      );

    case "tableCell":
      return (
        <td key={index} className="px-4 py-3 text-[#55564f]">
          {children}
        </td>
      );

    default:
      // Preserve nested text for nodes that do not have a custom renderer.
      return <div key={index}>{children}</div>;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await connection();

  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Article Not Found" };
  }

  const content = blog.content as TiptapNode;
  const description = getPlainText(content).trim().slice(0, 160);

  return {
    title: blog.title,
    description: description || `Read ${blog.title} on our journal.`,
    openGraph: {
      title: blog.title,
      description: description || `Read ${blog.title} on our journal.`,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  await connection();

  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const content = blog.content as TiptapNode;
  const readingTime = getReadingTime(content);
  const publishedDate = formatDate(blog.createdAt);
  const wasUpdated =
    blog.updatedAt.getTime() - blog.createdAt.getTime() > 60_000;

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#252620]">
      {/* Top navigation */}
      <header className="border-b border-[#eae7df] bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#777970] transition hover:text-[#a77b45]"
          >
            <ArrowLeft size={16} />
            Back to journal
          </Link>

          <Link
            href="/blog"
            className="font-serif text-xl font-semibold tracking-tight text-[#292a24]"
          >
            Storyline<span className="text-[#b58a56]">.</span>
          </Link>
        </div>
      </header>

      {/* Article header */}
      <section className="px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a77b45]">
            <span className="h-px w-8 bg-[#b58a56]" />
            From the journal
          </div>

          <h1 className="max-w-4xl font-serif text-4xl font-medium leading-[1.13] tracking-tight text-[#252620] sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-[#e7e3da] py-5 text-sm text-[#777970]">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#a77b45]" />
              <span>{publishedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={16} className="text-[#a77b45]" />
              <span>{readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#a77b45]" />
              <span>Article</span>
            </div>

            {wasUpdated ? (
              <span className="text-xs text-[#99958a]">
                Updated {formatDate(blog.updatedAt)}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <article className="rounded-2xl border border-[#ebe7df] bg-white px-6 py-9 shadow-[0_12px_45px_rgba(43,39,30,0.035)] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <div className="blog-content">{renderNode(content, 0)}</div>

            <div className="mt-14 border-t border-[#eeeae2] pt-8">
              <p className="font-serif text-xl italic text-[#777970]">
                Thank you for reading.
              </p>
              <p className="mt-2 text-sm text-[#99958a]">
                Explore more ideas and stories from our journal.
              </p>
            </div>
          </article>

          {/* Back to listing */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 rounded-full border border-[#dcd5c9] px-6 py-3 text-sm font-medium text-[#55564f] transition hover:border-[#a77b45] hover:bg-[#f2eee6] hover:text-[#8c643a]"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              Explore all articles
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#eae7df] px-5 py-7 text-center text-xs tracking-wide text-[#99958a] sm:px-8">
        © 2026 Storyline. All rights reserved.
      </footer>
    </main>
  );
}
