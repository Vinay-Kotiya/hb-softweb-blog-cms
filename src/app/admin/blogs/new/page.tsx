import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* <div className="mb-8">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-sm text-[#777970] transition hover:text-[#a77b45]"
          >
            <ArrowLeft size={16} />
            Back to content library
          </Link>
        </div> */}

        <BlogForm />
      </div>
    </main>
  );
}
