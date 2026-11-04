import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e6df] bg-[#f8f7f4]/95 backdrop-blur-xl">
      <div className="story-container flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#20231f] text-white">
            <BookOpen size={18} />
          </div>

          <div>
            <span className="font-editorial text-[23px] font-bold tracking-tight">
              Storyline
            </span>
            <span className="block text-[8px] font-semibold tracking-[0.25em] text-[#85857c]">
              THE EDITORIAL JOURNAL
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          <Link
            href="/"
            className="text-sm text-[#676961] transition hover:text-[#20231f]"
          >
            Home
          </Link>

          <Link
            href="/blog"
            className="text-sm text-[#676961] transition hover:text-[#20231f]"
          >
            Journal
          </Link>

          <a
            href="#about"
            className="text-sm text-[#676961] transition hover:text-[#20231f]"
          >
            About
          </a>
          <a
            href="tripadahealthcare-animation-recreate-task"
            className="text-sm text-[#676961] transition hover:text-[#20231f]"
          >
            Task 2
          </a>
        </nav>

        <Link
          href="/admin/blogs"
          className="flex items-center gap-2 rounded-full bg-[#20231f] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#a77b45]"
        >
          <span>Writer&apos;s Studio</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
