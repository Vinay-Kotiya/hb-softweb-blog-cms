// import ScrollRingGallery from "@/components/ScrollRingGallery";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <>
//       <main className="flex min-h-screen items-center justify-center bg-slate-950">
//         <div className="rounded-xl bg-white p-10 text-center shadow-xl">
//           <h1 className="text-4xl font-bold text-blue-600">
//             HB Softweb Blog CMS
//           </h1>

//           <p className="mt-4 text-gray-600">
//             Next.js and Tailwind CSS are working!
//           </p>

//           <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
//             Test Button
//           </button>
//         </div>
//       </main>
//       <ScrollRingGallery />
//     </>
//   );
// }

import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Sparkles } from "lucide-react";

import SiteShell from "@/components/site/site-shell";
import { getAllBlogs } from "@/services/blog.service";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function HomePage() {
  const blogs = await getAllBlogs();

  const featured = blogs[0];
  const latest = blogs.slice(1, 4);

  return (
    <SiteShell>
      {/* HERO */}

      <section className="story-container relative overflow-hidden py-20 md:py-28">
        <div className="absolute right-0 top-10 -z-10 size-72 rounded-full bg-[#e9dfcd]/50 blur-3xl" />

        <div className="max-w-4xl">
          <div className="editorial-kicker mb-7 flex items-center gap-2">
            <Sparkles size={13} />A JOURNAL FOR CURIOUS MINDS
          </div>

          <h1 className="font-editorial text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.98] tracking-[-0.065em]">
            Ideas deserve
            <br />
            <span className="text-[#a77b45]">a better story.</span>
          </h1>

          <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg text-base leading-8 text-[#777970] md:text-lg">
              Discover thoughtful perspectives, practical knowledge and
              meaningful stories. Read something that stays with you.
            </p>

            <Link
              href="/blog"
              className="group inline-flex w-fit items-center gap-3 border-b border-[#20231f] pb-2 text-sm font-semibold"
            >
              Explore the journal
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="mt-20 editorial-divider" />

        <div className="mt-5 flex justify-between text-[10px] font-semibold tracking-[0.18em] text-[#99998f]">
          <span>THOUGHTFUL CONTENT</span>
          <span>INDEPENDENT PERSPECTIVES</span>
          <span>EST. 2026</span>
        </div>
      </section>

      {/* FEATURED STORY */}

      <section className="story-container pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="editorial-kicker mb-2">THE EDITOR'S PICK</p>
            <h2 className="font-editorial text-3xl md:text-4xl">
              Featured story
            </h2>
          </div>

          <BookOpen className="text-[#a77b45]" size={27} />
        </div>

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-[#e8e6df] bg-white lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="editorial-art relative flex min-h-[340px] items-center justify-center p-10 md:min-h-[470px]">
              <div className="relative z-10 flex size-60 flex-col items-center justify-center rounded-full border border-[#74634c]/30 md:size-80">
                <span className="font-editorial text-8xl text-[#8b775d]/70 md:text-9xl">
                  S.
                </span>
                <span className="mt-2 text-[9px] font-bold tracking-[0.35em] text-[#8b775d]">
                  STORYLINE EDITION
                </span>
              </div>

              <span className="absolute bottom-8 left-8 text-xs tracking-widest text-[#82745e]">
                FEATURED ARTICLE
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="editorial-kicker mb-7">LATEST PERSPECTIVE</span>

              <h3 className="font-editorial text-4xl leading-tight tracking-tight transition-colors group-hover:text-[#a77b45] md:text-5xl">
                {featured.title}
              </h3>

              <p className="mt-7 line-clamp-4 text-sm leading-8 text-[#777970] md:text-base">
                {featured.excerpt}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-[#e8e6df] pt-6">
                <span className="text-xs text-[#85857c]">
                  {formatDate(featured.createdAt)}
                </span>

                <span className="flex items-center gap-2 text-sm font-semibold">
                  Read article
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-2"
                  />
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8d2c6] bg-white p-12 text-center md:p-20">
            <BookOpen size={35} className="mx-auto text-[#a77b45]" />

            <h3 className="font-editorial mt-5 text-3xl">
              Your first story starts here.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777970]">
              Publish your first article from the Writer's Studio and it will
              appear here automatically.
            </p>

            <Link
              href="/admin/blogs/new"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#20231f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a77b45]"
            >
              Create first article
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* LATEST STORIES */}

      <section className="bg-[#f0eee8] py-20 md:py-24">
        <div className="story-container">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="editorial-kicker mb-3">FRESHLY PUBLISHED</p>

              <h2 className="font-editorial text-4xl md:text-5xl">
                More to discover.
              </h2>
            </div>

            <Link
              href="/blog"
              className="flex w-fit items-center gap-2 text-sm font-semibold transition-colors hover:text-[#a77b45]"
            >
              All stories
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {latest.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {latest.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="article-card group flex flex-col p-7 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="editorial-kicker">
                      STORY {String(index + 2).padStart(2, "0")}
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="text-[#9c9c91] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#a77b45]"
                    />
                  </div>

                  <div className="my-9 flex h-36 items-center justify-center rounded-xl bg-[#f0eee8]">
                    <span className="font-editorial text-7xl text-[#b5a78f]">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl leading-snug transition-colors group-hover:text-[#a77b45]">
                    {blog.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#777970]">
                    {blog.excerpt}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-[#e8e6df] pt-5 text-xs text-[#85857c]">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>Read story →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#dedbd2] bg-[#f8f7f4] p-10 text-center">
              <p className="text-sm text-[#777970]">
                More stories will appear here as they are published.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL CTA */}

      <section className="story-container story-section">
        <div className="rounded-2xl bg-[#20231f] px-7 py-14 text-center text-white md:px-16 md:py-20">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#c6a77e]">
            THE STORY CONTINUES
          </p>

          <h2 className="font-editorial mx-auto mt-6 max-w-2xl text-4xl leading-tight md:text-6xl">
            There is always something new to discover.
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-white/60">
            Explore the journal and find your next interesting read.
          </p>

          <Link
            href="/blog"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#f8f7f4] px-7 py-4 text-sm font-semibold text-[#20231f] transition hover:bg-[#d9c6a8]"
          >
            Explore all stories
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
