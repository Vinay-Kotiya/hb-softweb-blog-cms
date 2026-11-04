import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer id="about" className="mt-20 border-t border-[#e8e6df] bg-[#f1efe9]">
      <div className="story-container grid gap-12 py-16 md:grid-cols-2 md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <span className="font-editorial text-2xl font-bold">
              Storyline.
            </span>
          </div>

          <h2 className="font-editorial mt-6 max-w-md text-4xl leading-tight">
            Ideas worth sharing. Stories worth remembering.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#777970]">
            A space for thoughtful ideas, useful knowledge and stories that
            inspire curious minds.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <div className="flex gap-7 text-sm">
            <Link href="/" className="hover:text-[#a77b45]">
              Home
            </Link>
            <Link href="/blog" className="hover:text-[#a77b45]">
              Journal
            </Link>
            <Link href="/admin/blogs" className="hover:text-[#a77b45]">
              Writer&apos;s Studio
            </Link>
          </div>

          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
          >
            Explore the journal
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <div className="border-t border-[#e0ded7]">
        <div className="story-container flex flex-col justify-between gap-3 py-6 text-xs text-[#85857c] sm:flex-row">
          <span>© 2026 Storyline. All rights reserved.</span>
          <span>Designed for thoughtful reading.</span>
        </div>
      </div>
    </footer>
  );
}
