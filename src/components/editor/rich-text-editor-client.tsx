"use client";

import { useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";

type RichTextEditorProps = {
  initialContent?: JSONContent;
  onChange: (content: JSONContent) => void;
};

const EMPTY_CONTENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const editorExtensions = [
  StarterKit.configure({
    link: {
      openOnClick: false,
      defaultProtocol: "https",
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: null,
      },
    },
  }),
  TextStyleKit,
];

const buttonClass =
  "rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

export default function RichTextEditor({
  initialContent,
  onChange,
}: RichTextEditorProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTarget, setLinkTarget] = useState<"_self" | "_blank">("_blank");
  const [linkError, setLinkError] = useState("");
  const [, setToolbarVersion] = useState(0);

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent ?? EMPTY_CONTENT,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "min-h-[320px] px-5 py-4 text-sm leading-7 outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },

    onSelectionUpdate: () => {
      setToolbarVersion((v) => v + 1);
    },

    onTransaction: () => {
      setToolbarVersion((v) => v + 1);
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[380px] animate-pulse rounded-xl border bg-slate-50" />
    );
  }

  const openLinkDialog = () => {
    const attributes = editor.getAttributes("link");

    setLinkUrl(attributes.href ?? "");
    setLinkTarget(attributes.target === "_self" ? "_self" : "_blank");
    setLinkError("");
    setLinkOpen(true);
  };

  const saveLink = () => {
    try {
      let href = linkUrl.trim();

      if (!href) {
        setLinkError("Please enter a destination URL.");
        return;
      }

      if (!/^[a-z][a-z\d+.-]*:/i.test(href)) {
        href = `https://${href}`;
      }

      const parsedUrl = new URL(href);

      if (
        !["http:", "https:", "mailto:", "tel:"].includes(parsedUrl.protocol)
      ) {
        throw new Error("Unsupported URL protocol.");
      }

      if (editor.state.selection.empty && !editor.isActive("link")) {
        setLinkError("Select some text before inserting a link.");
        return;
      }

      const attributes = {
        href,
        target: linkTarget,
        rel: "noopener noreferrer",
      };

      const chain = editor.chain().focus();

      if (editor.isActive("link")) {
        chain.extendMarkRange("link").setLink(attributes).run();
      } else {
        chain.setLink(attributes).run();
      }

      setLinkOpen(false);
      setLinkError("");
    } catch {
      setLinkError("Enter a valid HTTP, HTTPS, email or telephone URL.");
    }
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
    setLinkError("");
  };

  const activeButtonClass = (active: boolean) =>
    `${buttonClass} ${active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Formatting toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-slate-50 p-3">
        <button
          type="button"
          title="Bold"
          className={activeButtonClass(editor.isActive("bold"))}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          title="Italic"
          className={activeButtonClass(editor.isActive("italic"))}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          title="Underline"
          className={activeButtonClass(editor.isActive("underline"))}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </button>

        <div className="mx-1 h-6 border-l" />

        <button
          type="button"
          className={activeButtonClass(
            editor.isActive("heading", { level: 2 }),
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          className={activeButtonClass(editor.isActive("bulletList"))}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>

        <button
          type="button"
          className={activeButtonClass(editor.isActive("orderedList"))}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>

        <div className="mx-1 h-6 border-l" />

        {/* Text color */}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-white px-2 py-1.5 text-sm">
          <span>A</span>
          <span className="text-xs">Text color</span>
          <input
            type="color"
            aria-label="Choose text color"
            className="h-6 w-7 cursor-pointer"
            defaultValue="#2563eb"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>

        {/* Background color */}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-white px-2 py-1.5 text-sm">
          <span className="text-xs">Highlight</span>
          <input
            type="color"
            aria-label="Choose background color"
            className="h-6 w-7 cursor-pointer"
            defaultValue="#fde68a"
            onChange={(e) =>
              editor.chain().focus().setBackgroundColor(e.target.value).run()
            }
          />
        </label>

        <button
          type="button"
          className={buttonClass}
          title="Remove text styling"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().unsetColor().unsetBackgroundColor().run()
          }
        >
          Clear colors
        </button>

        <div className="mx-1 h-6 border-l" />

        {/* Hyperlinks */}
        <button
          type="button"
          className={activeButtonClass(editor.isActive("link"))}
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkDialog}
        >
          {editor.isActive("link") ? "Edit link" : "Insert link"}
        </button>

        <button
          type="button"
          className={buttonClass}
          disabled={!editor.isActive("link")}
          onMouseDown={(e) => e.preventDefault()}
          onClick={removeLink}
        >
          Remove link
        </button>
      </div>

      {/* Hyperlink dialog */}
      {linkOpen && (
        <div className="border-b bg-blue-50 p-4">
          <h3 className="mb-3 text-sm font-semibold">
            Insert / Edit hyperlink
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <div>
              <label className="mb-1 block text-sm font-medium">
                Open link in
              </label>

              <select
                value={linkTarget}
                onChange={(e) =>
                  setLinkTarget(e.target.value as "_self" | "_blank")
                }
                className="rounded-md border bg-white px-3 py-2 text-sm"
              >
                <option value="_self">Same browser tab</option>
                <option value="_blank">New browser tab</option>
              </select>
            </div>

            {linkError && <p className="text-sm text-red-600">{linkError}</p>}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveLink}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save link
              </button>

              <button
                type="button"
                onClick={() => setLinkOpen(false)}
                className="rounded-md border bg-white px-4 py-2 text-sm"
              >
                Cancel
              </button>

              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="rounded-md px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Remove hyperlink
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} />

      <div className="border-t bg-slate-50 px-4 py-2 text-xs text-slate-500">
        Select text to format it. Select linked text to edit or remove its
        hyperlink.
      </div>
    </div>
  );
}
