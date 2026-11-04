import BlogForm from "@/components/admin/blog-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-10">
      <div>
        <h1 className="text-3xl font-bold">Edit blog</h1>
        <p className="mt-2 text-slate-500">
          Update your blog title and formatted content.
        </p>
      </div>

      <BlogForm blogId={id} />
    </main>
  );
}
