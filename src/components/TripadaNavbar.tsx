"use client";

import Link from "next/link";

/**
 * TripadaNavbar - fixed white pill navigation, measured from the 1906 x 1078 screenshot.
 * All sizes are written in "u" = 1/1906 of the viewport width, so it is pixel-identical at
 * 1906px wide and scales proportionally at any other width.
 *
 * Put your logo at /public/images/tripada-logo.png (about 115 x 100 px at 1906 wide, or larger).
 * Tailwind is assumed (same as ScrollRingGallery); swap font-sans for your brand font.
 */

const u = (n: number) => `calc(var(--u) * ${n})`;

export default function TripadaNavbar({
  showScrollHint = true,
}: {
  showScrollHint?: boolean;
}) {
  return (
    <>
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-[1000]"
        style={{ ["--u" as string]: "calc(100vw / 1906)" }}
      >
        <nav
          className="pointer-events-auto absolute bg-white font-sans text-[#1b1b1b]"
          style={{
            left: u(100),
            top: u(30),
            width: u(1701),
            height: u(110),
            borderRadius: u(55),
          }}
          aria-label="Primary"
        >
          {/* logo */}
          <Link
            href="/"
            className="absolute block"
            style={{ left: u(50), top: u(5), width: u(115), height: u(100) }}
            aria-label="Tripada Healthcare Pvt. Ltd. home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tripada-logo-coloful.svg"
              alt="Tripada Healthcare Pvt. Ltd."
              className="h-full w-full object-contain"
              draggable={false}
            />
          </Link>

          {/* PRODUCTS */}
          <a
            href="/products"
            className="absolute flex items-center whitespace-nowrap uppercase"
            style={{
              left: u(1130),
              top: 0,
              height: "100%",
              fontSize: u(19.5),
              letterSpacing: "0.04em",
              fontWeight: 300,
            }}
          >
            Products
          </a>

          {/* thin divider, full height of the pill */}
          <span
            aria-hidden
            className="absolute bg-[#2a2a2a]"
            style={{ left: u(1303), top: u(1), width: 1, height: u(108) }}
          />

          {/* CAREERS */}
          <a
            href="/careers"
            className="absolute flex items-center whitespace-nowrap uppercase"
            style={{
              left: u(1364),
              top: 0,
              height: "100%",
              fontSize: u(19.5),
              letterSpacing: "0.04em",
              fontWeight: 300,
            }}
          >
            Careers
          </a>

          {/* CONTACT (outlined pill) */}
          <a
            href="/contact"
            className="absolute flex items-center justify-center uppercase transition-colors duration-300 hover:bg-[#1b8fd6] hover:text-white"
            style={{
              left: u(1504),
              top: u(21),
              width: u(166),
              height: u(69),
              borderRadius: u(35),
              border: "1px solid #1b8fd6",
              color: "#1b8fd6",
              fontSize: u(21),
              letterSpacing: "0.1em",
              fontWeight: 400,
            }}
          >
            Contact
          </a>
        </nav>
      </header>

      {/* small outlined pill at bottom centre of the viewport (seen in the screenshot) */}
      {showScrollHint && (
        <div
          aria-hidden
          className="pointer-events-none fixed left-1/2 z-[900] -translate-x-1/2"
          style={{
            ["--u" as string]: "calc(100vw / 1906)",
            bottom: u(70),
            width: u(49),
            height: u(11),
            borderRadius: u(6),
            border: "1.5px solid rgba(255,255,255,0.6)",
          }}
        />
      )}
    </>
  );
}
