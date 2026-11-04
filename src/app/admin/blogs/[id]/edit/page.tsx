import { Suspense } from "react";

import BlogForm from "@/components/admin/blog-form";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

function EditBlogFallback() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-5 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="h-12 animate-pulse rounded bg-gray-200" />
      <div className="h-80 animate-pulse rounded bg-gray-200" />
    </main>
  );
}

async function EditBlogContent({ params }: EditBlogPageProps) {
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

export default function EditBlogPage({ params }: EditBlogPageProps) {
  return (
    <Suspense fallback={<EditBlogFallback />}>
      <EditBlogContent params={params} />
    </Suspense>
  );
}

// import BlogForm from "@/components/admin/blog-form";
// import { Suspense } from "react";

// type PageProps = {
//   params: Promise<{ id: string }>;
// };
// type EditBlogPageProps = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// function EditBlogFallback() {
//   return (
//     <div className="mx-auto w-full max-w-5xl space-y-6">
//       <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
//       <div className="h-12 animate-pulse rounded bg-gray-200" />
//       <div className="h-80 animate-pulse rounded bg-gray-200" />
//     </div>
//   );
// }

// async function EditBlogContent({ params }: PageProps) {
//   const { id } = await params;

//   return (
//     <main className="mx-auto max-w-5xl space-y-6 px-5 py-10">
//       <div>
//         <h1 className="text-3xl font-bold">Edit blog</h1>
//         <p className="mt-2 text-slate-500">
//           Update your blog title and formatted content.
//         </p>
//       </div>

//       <BlogForm blogId={id} />
//     </main>
//   );
// }

// export default function EditBlogPage({ params }: EditBlogPageProps) {
//   return (
//     <Suspense fallback={<EditBlogFallback />}>
//       <EditBlogContent params={params} />
//     </Suspense>
//   );
// }
