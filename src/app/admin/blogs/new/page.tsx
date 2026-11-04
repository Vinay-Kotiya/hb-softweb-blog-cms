import BlogForm from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <BlogForm />
      </div>
    </main>
  );
}
