import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Search } from "lucide-react";

export default function BlogNotFound() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f7f4] text-[#252620]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-[450px] w-[450px] rounded-full border border-[#e8dfd0] opacity-60" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-[330px] w-[330px] rounded-full border border-[#e8dfd0] opacity-60" />
      <div className="pointer-events-none absolute -bottom-36 -left-28 h-[400px] w-[400px] rounded-full border border-[#e8dfd0] opacity-50" />

      {/* Header */}
      <header className="relative z-10 border-b border-[#eae7df]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-tight"
          >
            Storyline<span className="text-[#b58a56]">.</span>
          </Link>

          <Link
            href="/blog"
            className="text-sm font-medium text-[#777970] transition hover:text-[#a77b45]"
          >
            Explore articles
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-5 py-20 sm:px-8">
        <div className="mx-auto w-full max-w-2xl text-center">
          <div className="mx-auto mb-9 flex h-16 w-16 items-center justify-center rounded-full border border-[#e5dac9] bg-white text-[#a77b45] shadow-sm">
            <BookOpen size={27} strokeWidth={1.3} />
          </div>

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#a77b45]">
            Lost in the pages
          </p>

          <h1 className="font-serif text-[100px] font-medium leading-none tracking-tighter text-[#d8cbb8] sm:text-[150px]">
            404
          </h1>

          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-[#292a24] sm:text-4xl">
            This story couldn&apos;t be found.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-[#777970] sm:text-base">
            The article you&apos;re looking for may have been moved, removed, or
            the link might be incorrect. But there are plenty of other stories
            waiting to be discovered.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[#292a24] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#a77b45]"
            >
              <ArrowLeft size={16} />
              Explore all articles
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#ded6c9] px-7 py-3.5 text-sm font-medium text-[#55564f] transition hover:border-[#a77b45] hover:bg-white hover:text-[#a77b45]"
            >
              Back to homepage
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mx-auto mt-16 flex max-w-sm items-center justify-center gap-3 border-t border-[#e7e3da] pt-7 text-xs tracking-wide text-[#99958a]">
            <Search size={14} />
            <span>Sometimes the best stories are still ahead.</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#eae7df] px-5 py-7 text-center text-xs tracking-wide text-[#99958a]">
        © {new Date().getFullYear()} Storyline. All rights reserved.
      </footer>
    </main>
  );
}
