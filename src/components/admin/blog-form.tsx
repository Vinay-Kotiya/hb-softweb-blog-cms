"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  FileText,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import RichTextEditor from "@/components/editor/rich-text-editor";

type BlogFormProps = {
  blogId?: string;
};

const EMPTY_CONTENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function getTextFromContent(node: JSONContent): string {
  let text = node.text || "";

  if (node.content) {
    text += node.content.map((child) => getTextFromContent(child)).join(" ");
  }

  return text;
}

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();

  const isEditing = Boolean(blogId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent>(EMPTY_CONTENT);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState(false);

  const wordCount = getTextFromContent(content)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Load existing blog when editing
  useEffect(() => {
    if (!blogId) return;

    let active = true;

    async function loadBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${blogId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load blog");
        }

        if (!active) return;

        setTitle(result.data.title);
        setContent(result.data.content as JSONContent);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the article.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlog();

    return () => {
      active = false;
    };
  }, [blogId]);

  // Create or update blog
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLastSaved(false);

    if (!title.trim()) {
      setError("Please enter an article title.");
      return;
    }

    if (!getTextFromContent(content).trim()) {
      setError("Please write some article content before publishing.");
      return;
    }

    setSaving(true);

    try {
      const endpoint = isEditing
        ? `/api/admin/blogs/${blogId}`
        : "/api/admin/blogs";

      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save article");
      }

      setLastSaved(true);

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the article.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#a77b45]" size={30} />

        <p className="text-sm text-[#85857c]">Loading your article...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top navigation */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-[#777970] transition hover:text-[#a77b45]"
        >
          <ArrowLeft size={16} />
          Back to articles
        </Link>

        <div className="flex items-center gap-2 text-xs text-[#85857c]">
          <span className="size-2 rounded-full bg-emerald-500" />
          Connected to your content database
        </div>
      </div>

      {/* Page heading */}

      <div className="border-b border-[#e8e6df] pb-7">
        <p className="editorial-kicker mb-3 flex items-center gap-2">
          <Sparkles size={13} />
          EDITORIAL WORKSPACE
        </p>

        <h1 className="font-editorial text-4xl tracking-tight text-[#252720] md:text-5xl">
          {isEditing ? "Refine your story." : "Create a new story."}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-[#777970]">
          {isEditing
            ? "Make your changes, refine your writing and update your published article."
            : "Every great article starts with an idea. Give yours a title and bring it to life."}
        </p>
      </div>

      {/* Main editor layout */}

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Writing workspace */}

        <div className="min-w-0 space-y-6">
          {/* Title editor */}

          <section className="rounded-2xl border border-[#e8e6df] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <FileText size={16} className="text-[#a77b45]" />

              <label
                htmlFor="blog-title"
                className="text-xs font-semibold tracking-widest text-[#777970]"
              >
                ARTICLE TITLE
              </label>

              <span className="text-red-500">*</span>
            </div>

            <input
              id="blog-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setLastSaved(false);
              }}
              maxLength={180}
              required
              placeholder="Give your story a meaningful title..."
              className="w-full border-0 bg-transparent font-editorial text-3xl leading-tight tracking-tight text-[#252720] outline-none placeholder:text-[#c3c0b7] sm:text-4xl"
            />

            <div className="mt-7 flex items-center justify-between border-t border-[#eeeae3] pt-4">
              <span className="text-[11px] text-[#99998f]">
                Keep your title clear and engaging.
              </span>

              <span
                className={`text-xs tabular-nums ${
                  title.length > 160 ? "text-amber-600" : "text-[#99998f]"
                }`}
              >
                {title.length}/180
              </span>
            </div>
          </section>

          {/* Rich text editor */}

          <section className="overflow-hidden rounded-2xl border border-[#e8e6df] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e6df] px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#a77b45]" />

                  <h2 className="text-sm font-semibold text-[#252720]">
                    Your story
                  </h2>

                  <span className="text-red-500">*</span>
                </div>

                <p className="mt-1 text-xs text-[#99998f]">
                  Write, format and structure your article.
                </p>
              </div>

              <span className="rounded-full bg-[#f5f3ee] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#85857c]">
                RICH TEXT EDITOR
              </span>
            </div>

            <div className="min-h-[480px] p-4 sm:p-7">
              <RichTextEditor
                key={blogId || "new-blog"}
                initialContent={content}
                onChange={(value) => {
                  setContent(value);
                  setLastSaved(false);
                }}
              />
            </div>

            {/* Writing statistics */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e6df] bg-[#faf9f6] px-6 py-4">
              <div className="flex items-center gap-5 text-[11px] text-[#85857c]">
                <span className="flex items-center gap-1.5">
                  <FileText size={13} />
                  {wordCount} words
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} />
                  {readingTime} min read
                </span>
              </div>

              <span className="text-[10px] text-[#99998f]">
                Your content is saved when you publish.
              </span>
            </div>
          </section>
        </div>

        {/* Publishing sidebar */}

        <aside className="space-y-5 lg:sticky lg:top-8">
          {/* Publishing panel */}

          <section className="rounded-2xl border border-[#e8e6df] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-editorial text-2xl">Publishing</h2>

              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                READY
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e9]">
                  <GlobeIcon />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#252720]">
                    Public visibility
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#85857c]">
                    Published articles are available on your public blog.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e9]">
                  <FileText size={16} className="text-[#a77b45]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#252720]">
                    SEO-friendly URL
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#85857c]">
                    Your URL slug is generated automatically from the title.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#eeeae3]" />

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#252720] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a77b45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving article...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {isEditing ? "Update article" : "Publish article"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => router.push("/admin/blogs")}
                  className="w-full rounded-full border border-[#e8e6df] px-5 py-3 text-sm font-medium text-[#777970] transition hover:bg-[#f8f7f4] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>

          {/* Writing tips */}

          <section className="rounded-2xl border border-[#e8e6df] bg-[#f1eee7] p-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#a77b45]" />

              <h3 className="font-editorial text-xl">A little inspiration.</h3>
            </div>

            <p className="mt-3 text-xs leading-6 text-[#777970]">
              Great articles have a clear purpose. Start with a compelling
              introduction, organize your thoughts into meaningful sections and
              give readers something valuable to take away.
            </p>
          </section>

          {/* Article overview */}

          <section className="rounded-2xl border border-[#e8e6df] bg-white p-6">
            <p className="editorial-kicker mb-4">ARTICLE OVERVIEW</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#85857c]">Words</span>
                <span className="font-semibold text-[#252720]">
                  {wordCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#85857c]">Reading time</span>
                <span className="font-semibold text-[#252720]">
                  {readingTime} min
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#85857c]">Title length</span>
                <span className="font-semibold text-[#252720]">
                  {title.length}/180
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Error feedback */}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="font-bold">!</span>
          <p>{error}</p>
        </div>
      )}
    </form>
  );
}

function GlobeIcon() {
  return <ArrowUpRight size={17} className="text-[#a77b45]" />;
}

// "use client";

// import { useEffect, useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import type { JSONContent } from "@tiptap/core";

// import RichTextEditor from "@/components/editor/rich-text-editor";

// type BlogFormProps = {
//   blogId?: string;
// };

// const EMPTY_CONTENT: JSONContent = {
//   type: "doc",
//   content: [{ type: "paragraph" }],
// };

// export default function BlogForm({ blogId }: BlogFormProps) {
//   const router = useRouter();

//   const isEditing = Boolean(blogId);

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState<JSONContent>(EMPTY_CONTENT);

//   const [loading, setLoading] = useState(isEditing);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // Load existing blog when editing
//   useEffect(() => {
//     if (!blogId) return;

//     let active = true;

//     async function loadBlog() {
//       try {
//         const response = await fetch(`/api/admin/blogs/${blogId}`);

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || "Failed to load blog");
//         }

//         if (!active) return;

//         setTitle(result.data.title);
//         setContent(result.data.content as JSONContent);
//       } catch (err) {
//         if (!active) return;

//         setError(err instanceof Error ? err.message : "Something went wrong");
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     loadBlog();

//     return () => {
//       active = false;
//     };
//   }, [blogId]);

//   // Create or update blog
//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");

//     if (!title.trim()) {
//       setError("Please enter a blog title.");
//       return;
//     }

//     setSaving(true);

//     try {
//       const endpoint = isEditing
//         ? `/api/admin/blogs/${blogId}`
//         : "/api/admin/blogs";

//       const response = await fetch(endpoint, {
//         method: isEditing ? "PATCH" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           content,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Unable to save blog");
//       }

//       router.push("/admin/blogs");
//       router.refresh();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-slate-500">
//         Loading existing blog...
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label className="mb-2 block text-sm font-semibold">
//           Blog title <span className="text-red-500">*</span>
//         </label>

//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           maxLength={180}
//           required
//           placeholder="Enter your blog title..."
//           className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />

//         <p className="mt-1 text-xs text-slate-400">
//           {title.length}/180 characters
//         </p>
//       </div>

//       <div>
//         <label className="mb-2 block text-sm font-semibold">
//           Blog description <span className="text-red-500">*</span>
//         </label>

//         <RichTextEditor initialContent={content} onChange={setContent} />
//       </div>

//       {error && (
//         <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-5">
//         <button
//           type="button"
//           disabled={saving}
//           onClick={() => router.push("/admin/blogs")}
//           className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           disabled={saving || !title.trim()}
//           className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {saving ? "Saving..." : isEditing ? "Update blog" : "Publish blog"}
//         </button>
//       </div>
//     </form>
//   );
// }
