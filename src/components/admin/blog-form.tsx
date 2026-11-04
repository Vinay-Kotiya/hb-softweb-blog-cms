"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";

import RichTextEditor from "@/components/editor/rich-text-editor";

type BlogFormProps = {
  blogId?: string;
};

const EMPTY_CONTENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();

  const isEditing = Boolean(blogId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent>(EMPTY_CONTENT);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

        setError(err instanceof Error ? err.message : "Something went wrong");
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

    if (!title.trim()) {
      setError("Please enter a blog title.");
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
          title,
          content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save blog");
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading existing blog...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Blog title <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={180}
          required
          placeholder="Enter your blog title..."
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-xs text-slate-400">
          {title.length}/180 characters
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Blog description <span className="text-red-500">*</span>
        </label>

        <RichTextEditor initialContent={content} onChange={setContent} />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-5">
        <button
          type="button"
          disabled={saving}
          onClick={() => router.push("/admin/blogs")}
          className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update blog" : "Publish blog"}
        </button>
      </div>
    </form>
  );
}
