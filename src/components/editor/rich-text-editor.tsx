"use client";

import dynamic from "next/dynamic";
import type { JSONContent } from "@tiptap/core";

type RichTextEditorProps = {
  initialContent?: JSONContent;
  onChange: (content: JSONContent) => void;
};

const RichTextEditorClient = dynamic<RichTextEditorProps>(
  () => import("./rich-text-editor-client"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[320px] animate-pulse rounded-xl border border-[#eae7df] bg-white" />
    ),
  },
);

export default function RichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditorClient {...props} />;
}
