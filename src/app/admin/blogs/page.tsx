import { connection } from "next/server";
import { getAllBlogs } from "@/services/blog.service";
import BlogManagement from "@/components/admin/blog-management";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export const instant = false;
export default async function AdminBlogsPage() {
  // Use request-time data with Cache Components enabled.
  await connection();

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

// import Link from "next/link";
// import { ArrowUpRight, BookOpen } from "lucide-react";

// import SiteShell from "@/components/site/site-shell";
// import { getAllBlogs } from "@/services/blog.service";

// function formatDate(date: Date) {
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(date));
// }

// export default async function BlogListingPage() {
//   const blogs = await getAllBlogs();

//   return (
//     <SiteShell>
//       <section className="story-container py-20 md:py-28">
//         <div className="max-w-3xl">
//           <p className="editorial-kicker mb-6 flex items-center gap-2">
//             <BookOpen size={13} />
//             THE STORYLINE JOURNAL
//           </p>

//           <h1 className="font-editorial text-6xl leading-[1.05] tracking-tight md:text-8xl">
//             Every story
//             <br />
//             <span className="text-[#a77b45]">has a place.</span>
//           </h1>

//           <p className="mt-8 max-w-xl text-base leading-8 text-[#777970] md:text-lg">
//             A collection of ideas, perspectives and practical insights created
//             to inform, inspire and spark curiosity.
//           </p>
//         </div>

//         <div className="editorial-divider my-16" />

//         <div className="mb-10 flex items-end justify-between">
//           <div>
//             <p className="editorial-kicker mb-2">THE COLLECTION</p>
//             <h2 className="font-editorial text-3xl md:text-4xl">All stories</h2>
//           </div>

//           <span className="text-xs text-[#85857c]">
//             {blogs.length} {blogs.length === 1 ? "article" : "articles"}
//           </span>
//         </div>

//         {blogs.length > 0 ? (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {blogs.map((blog, index) => (
//               <Link
//                 key={blog.id}
//                 href={`/blog/${blog.slug}`}
//                 className="article-card group flex flex-col"
//               >
//                 <div className="editorial-art flex h-56 items-center justify-center">
//                   <span className="font-editorial relative z-10 text-8xl text-[#86775d]/70">
//                     {String(index + 1).padStart(2, "0")}
//                   </span>

//                   <span className="absolute bottom-5 left-5 z-10 text-[9px] font-semibold tracking-[0.2em] text-[#756750]">
//                     STORYLINE EDITION
//                   </span>
//                 </div>

//                 <div className="flex flex-1 flex-col p-7">
//                   <div className="flex items-center justify-between text-[10px] tracking-widest text-[#99998f]">
//                     <span>ARTICLE {String(index + 1).padStart(2, "0")}</span>
//                     <span>{formatDate(blog.createdAt)}</span>
//                   </div>

//                   <h3 className="font-editorial mt-5 text-2xl leading-snug transition-colors group-hover:text-[#a77b45]">
//                     {blog.title}
//                   </h3>

//                   <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#777970]">
//                     {blog.excerpt}
//                   </p>

//                   <div className="mt-auto flex items-center justify-between border-t border-[#e8e6df] pt-6 mt-7 text-sm font-semibold">
//                     <span>Read article</span>

//                     <ArrowUpRight
//                       size={17}
//                       className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
//                     />
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-2xl border border-dashed border-[#d8d2c6] bg-white px-6 py-20 text-center">
//             <BookOpen size={35} className="mx-auto text-[#a77b45]" />

//             <h3 className="font-editorial mt-6 text-3xl">
//               A new chapter awaits.
//             </h3>

//             <p className="mt-3 text-sm text-[#777970]">
//               There are no published stories yet.
//             </p>
//           </div>
//         )}
//       </section>
//     </SiteShell>
//   );
// }

// // import Link from "next/link";
// // import { getAllBlogs } from "@/services/blog.service";

// // // export const dynamic = "force-dynamic";

// // export default async function AdminBlogsPage() {
// //   const blogs = await getAllBlogs();

// //   return (
// //     <main className="mx-auto max-w-6xl space-y-7 px-5 py-10">
// //       <div className="flex flex-wrap items-center justify-between gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold">Blog Management</h1>
// //           <p className="mt-2 text-sm text-slate-500">
// //             Create and manage your published content.
// //           </p>
// //         </div>

// //         <Link
// //           href="/admin/blogs/new"
// //           className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
// //         >
// //           + Create blog
// //         </Link>
// //       </div>

// //       <div className="overflow-hidden rounded-xl border bg-white">
// //         {blogs.length === 0 ? (
// //           <div className="p-12 text-center">
// //             <h2 className="font-semibold">No blogs found</h2>
// //             <p className="mt-2 text-sm text-slate-500">
// //               Create your first blog to get started.
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="divide-y">
// //             {blogs.map((blog) => (
// //               <div
// //                 key={blog.id}
// //                 className="flex flex-wrap items-center justify-between gap-4 p-5"
// //               >
// //                 <div className="min-w-0 flex-1">
// //                   <h2 className="truncate font-semibold">{blog.title}</h2>

// //                   <p className="mt-1 text-sm text-slate-500">
// //                     /blog/{blog.slug}
// //                   </p>

// //                   <p className="mt-2 line-clamp-2 text-sm text-slate-600">
// //                     {blog.excerpt}
// //                   </p>
// //                 </div>

// //                 <Link
// //                   href={`/admin/blogs/${blog.id}/edit`}
// //                   className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
// //                 >
// //                   Edit
// //                 </Link>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       <p className="text-sm text-slate-500">Total blogs: {blogs.length}</p>
// //     </main>
// //   );
// // }
