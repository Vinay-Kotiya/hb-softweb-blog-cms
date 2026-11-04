import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAllBlogs } from "@/services/blog.service";
import BlogManagement from "@/components/admin/blog-management";

function AdminBlogsFallback() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="mb-8 h-4 w-56 animate-pulse rounded bg-gray-200" />

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-[#eae7df] bg-white"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

async function AdminBlogsContent() {
  const blogs = await getAllBlogs();

  // Convert Date objects to serializable strings for the client component.
  const serializedBlogs = blogs.map((blog) => ({
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#777970] transition hover:text-[#a77b45]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xs font-medium tracking-widest text-[#99998f]">
            STORYLINE / ADMINISTRATION
          </p>
        </div>

        <BlogManagement blogs={serializedBlogs} />
      </div>
    </main>
  );
}

export default function AdminBlogsPage() {
  return (
    <Suspense fallback={<AdminBlogsFallback />}>
      <AdminBlogsContent />
    </Suspense>
  );
}

// import { connection } from "next/server";
// import { getAllBlogs } from "@/services/blog.service";
// import BlogManagement from "@/components/admin/blog-management";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// export const instant = false;
// export default async function AdminBlogsPage() {
//   // Use request-time data with Cache Components enabled.
//   await connection();

//   const blogs = await getAllBlogs();

//   // Convert Date objects to serializable strings for the client component.
//   const serializedBlogs = blogs.map((blog) => ({
//     ...blog,
//     createdAt: blog.createdAt.toISOString(),
//     updatedAt: blog.updatedAt.toISOString(),
//   }));

//   return (
//     <main className="min-h-screen bg-[#f8f7f4] px-4 py-10 sm:px-6 lg:px-10">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-8">
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-sm text-[#777970] transition hover:text-[#a77b45]"
//           >
//             <ArrowLeft size={16} />
//             Back to Home
//           </Link>
//         </div>
//         {/* Breadcrumb */}
//         <div className="mb-8 flex items-center justify-between">
//           <p className="text-xs font-medium tracking-widest text-[#99998f]">
//             STORYLINE / ADMINISTRATION
//           </p>
//         </div>

//         <BlogManagement blogs={serializedBlogs} />
//       </div>
//     </main>
//   );
// }
