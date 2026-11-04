


/////////////////////////////////////////////V4////////////////////////////////

"use client";

/**
 * ScrollRingGallery  (v4)
 *
 * One ring of 17 images for the whole scroll. Nothing is gathered into a pile.
 *
 *   Section 1  bowl of upright images sliding right -> left along the bottom
 *   1 -> 2     images shrink; the right-hand images swing over to the left and the
 *              left-hand ones to the right while the ring closes around the headline
 *              (each image starts a little after the previous one, so it flows)
 *   Section 2  complete ring around "2011 Year of Foundation", rotating with scroll
 *   2 -> 3     images leave the ring one after another (nearest-to-the-left first)
 *              and arrange themselves on the arc at the left of section 3
 *   Section 3  arc on the left, stats list scrolling on the right
 *
 * Every number is in KEYS (time = seconds of the reference video). Use ?t=12.5 in the
 * URL to freeze the animation at that moment while tuning.
 *
 * npm i gsap @gsap/react lenis
 * /public/gallery/1.jpg ... 17.jpg      (see TripadaNavbar.tsx for the nav bar)
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const COUNT = 17;
const IMAGE_FILES = 17;
const IMAGES = Array.from(
  { length: COUNT },
  (_, i) => `/gallery/${(i % IMAGE_FILES) + 1}.jpg`,
);

const STATS = [
  { value: "15+", label: "Years of experience" },
  { value: "490+", label: "Completed projects" },
  { value: "45+", label: "Professionals on the team" },
  { value: "40K", label: "Total area covered" },
];

const IMG_W_VW = 19.5; // width of an image at scale 1 (the bowl phase)
const RING_STEP = 360 / COUNT; // spacing when the ring is complete
const TOTAL = 57; // seconds of the reference video that we animate
const VH_PER_SEC = 10; // scroll distance per second of video
const SCROLL_VH = 100 + TOTAL * VH_PER_SEC;

/* ------------------------------------------------------------------ */
/* THE KEYFRAMES  (edit these to match the video)                      */
/* ------------------------------------------------------------------ */
/**
 * t      video second
 * cx,cy  circle centre as a fraction of stage width / height
 * R      circle radius as a fraction of stage width
 * step   degrees between neighbouring images along the circle
 * sc     image scale (1 = IMG_W_VW wide)
 * ar     image width / height
 * phi    extra image rotation: -180 = upright at the bottom of the circle
 *        (bowl phase), 0 = outward facing (ring phase, upside-down at bottom)
 * rot    angle of image 0, clockwise from the top of the circle, in degrees
 */
type Key = {
  t: number; cx: number; cy: number; R: number;
  step: number; sc: number; ar: number; phi: number; rot: number;
};

const S = RING_STEP;
const KEYS: Key[] = [
  // --- Section 1: bowl, sliding left and up with the page ---
  { t: 0,    cx: 0.55,  cy: -1.31, R: 1.26, step: 11, sc: 1.0,  ar: 0.8,  phi: -180, rot: 190 },
  { t: 7,    cx: 0.2,   cy: -1.39, R: 1.26, step: 11, sc: 1.0,  ar: 0.8,  phi: -180, rot: 188 },
  { t: 10.2, cx: 0.16,  cy: -1.7,  R: 1.26, step: 11, sc: 1.0,  ar: 0.8,  phi: -180, rot: 188 },
  // --- 1 -> 2: swing across, shrink, close the ring around the headline ---
  { t: 12.8, cx: 0.4,   cy: 0.12,  R: 0.5,  step: 18, sc: 0.9,  ar: 0.95, phi: -110, rot: 270 },
  { t: 15.5, cx: 0.22,  cy: 1.05,  R: 0.55, step: S,  sc: 0.72, ar: 1.0,  phi: -30,  rot: 395 },
  { t: 18,   cx: 0.38,  cy: 0.8,   R: 0.47, step: S,  sc: 0.64, ar: 1.0,  phi: 0,    rot: 430 },
  // --- Section 2: ring centred on the headline, visibly rotating ---
  { t: 20.5, cx: 0.5,   cy: 0.5,   R: 0.42, step: S,  sc: 0.6,  ar: 1.0,  phi: 0,    rot: 455 },
  { t: 24,   cx: 0.5,   cy: 0.45,  R: 0.42, step: S,  sc: 0.6,  ar: 1.0,  phi: 0,    rot: 486 },
  { t: 27,   cx: 0.5,   cy: 0.1,   R: 0.41, step: S,  sc: 0.6,  ar: 1.0,  phi: 0,    rot: 500 },
  // --- 2 -> 3: ring pours into the arc on the left ---
  { t: 33,   cx: 0.3,   cy: 0.35,  R: 0.36, step: S,  sc: 0.6,  ar: 1.0,  phi: 0,    rot: 525 },
  { t: 38,   cx: 0.08,  cy: 0.8,   R: 0.42, step: S,  sc: 0.62, ar: 1.0,  phi: 0,    rot: 545 },
  { t: 43,   cx: -0.03, cy: 1.02,  R: 0.49, step: S,  sc: 0.66, ar: 1.0,  phi: 0,    rot: 565 },
  // --- Section 3: arc on the left edge, scrolling up ---
  { t: 50,   cx: 0.007, cy: 0.161, R: 0.408,step: S,  sc: 0.66, ar: 1.0,  phi: 0,    rot: 590 },
  { t: 57,   cx: 0.0,   cy: -0.45, R: 0.41, step: S,  sc: 0.66, ar: 1.0,  phi: 0,    rot: 615 },
];

/**
 * Stagger windows. Inside [t0, t1] image number k (in `order`) starts k*d seconds after
 * the first one, and all images finish together at t1. Outside the windows every image
 * follows the same clock, so the ring is rigid.
 */
type Win = { t0: number; t1: number; d: number; order: number[] };
const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
const WINDOWS: Win[] = [
  // 1 -> 2: leftmost image of the bowl leads
  { t0: 10.2, t1: 20.5, d: 0.28, order: Array.from({ length: COUNT }, (_, i) => i) },
  // 2 -> 3: images nearest the left side of the ring go first, then the next, ...
  {
    t0: 27, t1: 43, d: 0.45,
    order: (() => {
      const rot0 = KEYS.find((k) => k.t === 27)!.rot;
      const idx = Array.from({ length: COUNT }, (_, i) => i).sort(
        (a, b) =>
          Math.abs(wrap180(rot0 - a * S - 270)) - Math.abs(wrap180(rot0 - b * S - 270)),
      );
      const rank: number[] = [];
      idx.forEach((img, r) => (rank[img] = r));
      return rank;
    })(),
  },
];

/** The animation clock of image i at scroll time t. */
const tau = (i: number, t: number) => {
  for (const w of WINDOWS) {
    if (t > w.t0 && t < w.t1) {
      const W = w.t1 - w.t0;
      const run = W - (COUNT - 1) * w.d;
      const p = Math.min(1, Math.max(0, (t - w.t0 - w.order[i] * w.d) / run));
      return w.t0 + p * W;
    }
  }
  return t;
};

/** Text blocks scroll like normal page content: [t, translateY in vh] */
const H1_Y: [number, number][] = [[0, 0], [7, -35], [9, -55], [11.2, -90]];
const H2_Y: [number, number][] = [[15.5, 62], [23, 0], [24.5, 0], [29, -67], [32, -95]];
/** y of the top of the first stats row, in vh. Rows are STAT_ROW_VH apart. */
const STATS_Y: [number, number][] = [
  [33, 100], [34.3, 92.5], [44, 7.5], [46, -19.5], [48, -38],
  [50, -71.5], [52, -103.5], [54, -132], [57, -165],
];
const STAT_ROW_VH = 47;
const STAT_FOCUS_VH = 40; // row centre that is fully lit, in vh from the top

/* ------------------------------------------------------------------ */
/* Math                                                                */
/* ------------------------------------------------------------------ */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Monotone cubic (Fritsch-Carlson) interpolation: smooth, no overshoot. */
function pchip(ts: number[], vs: number[]) {
  const n = ts.length;
  const h: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h[i] = ts[i + 1] - ts[i];
    d[i] = (vs[i + 1] - vs[i]) / h[i];
  }
  const m: number[] = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  return (t: number) => {
    const x = clamp(t, ts[0], ts[n - 1]);
    let i = 0;
    while (i < n - 2 && x > ts[i + 1]) i++;
    const u = (x - ts[i]) / h[i];
    const u2 = u * u;
    const u3 = u2 * u;
    return (
      (2 * u3 - 3 * u2 + 1) * vs[i] +
      (u3 - 2 * u2 + u) * h[i] * m[i] +
      (-2 * u3 + 3 * u2) * vs[i + 1] +
      (u3 - u2) * h[i] * m[i + 1]
    );
  };
}

function linear(pts: [number, number][]) {
  return (t: number) => {
    if (t <= pts[0][0]) return pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) {
      const [t0, v0] = pts[i];
      const [t1, v1] = pts[i + 1];
      if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
    return pts[pts.length - 1][1];
  };
}

const ts = KEYS.map((k) => k.t);
const f = {
  cx: pchip(ts, KEYS.map((k) => k.cx)),
  cy: pchip(ts, KEYS.map((k) => k.cy)),
  R: pchip(ts, KEYS.map((k) => k.R)),
  step: pchip(ts, KEYS.map((k) => k.step)),
  sc: pchip(ts, KEYS.map((k) => k.sc)),
  ar: pchip(ts, KEYS.map((k) => k.ar)),
  phi: pchip(ts, KEYS.map((k) => k.phi)),
  rot: pchip(ts, KEYS.map((k) => k.rot)),
};
const h1y = linear(H1_Y);
const h2y = linear(H2_Y);
const statsY = linear(STATS_Y);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ScrollRingGallery({
  smoothScroll = true,
}: {
  smoothScroll?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const statItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const stage = stageRef.current!;
      const imgs = imgRefs.current.filter(Boolean) as HTMLDivElement[];
      const rows = statItemRefs.current.filter(Boolean) as HTMLDivElement[];
      const h1 = h1Ref.current!;
      const h2 = h2Ref.current!;

      const render = (t: number) => {
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        const vh = H / 100;

        const w = (W * IMG_W_VW) / 100;

        for (let i = 0; i < imgs.length; i++) {
          const ti = tau(i, t);
          const cx = f.cx(ti) * W;
          const cy = f.cy(ti) * H;
          const R = f.R(ti) * W;
          const th = f.rot(ti) - i * f.step(ti); // degrees clockwise from the top
          const rad = (th * Math.PI) / 180;
          const el = imgs[i];
          el.style.height = `${w / f.ar(ti)}px`;
          el.style.transform = `translate3d(${cx + R * Math.sin(rad)}px,${
            cy - R * Math.cos(rad)
          }px,0) translate(-50%,-50%) rotate(${th + f.phi(ti)}deg) scale(${f.sc(ti)})`;
        }

        // Section 1 heading: scrolls away like page content
        const y1 = h1y(t);
        h1.style.transform = `translate3d(0,${y1}vh,0)`;
        h1.style.visibility = y1 < -88 ? "hidden" : "visible";

        // Section 2 heading: rises from below, then scrolls off the top
        const y2 = h2y(t);
        h2.style.transform = `translate3d(0,${y2}vh,0)`;
        h2.style.visibility = t < 15.4 || y2 < -94 ? "hidden" : "visible";

        // Stats: plain scrolling list; rows light up near the focus line
        const top0 = statsY(t);
        rows.forEach((el, i) => {
          const top = top0 + i * STAT_ROW_VH;
          const centre = top + 9; // visual centre of value + label
          const d = Math.abs(centre - STAT_FOCUS_VH) / 100;
          el.style.transform = `translate3d(0,${top * vh}px,0)`;
          el.style.opacity = String(clamp(1 - 3.6 * d, 0.12, 1));
          el.style.visibility = t < 33 ? "hidden" : "visible";
        });
      };

      render(0);

      // Debug: ?t=12.5 freezes the animation at that video second.
      const dbg = new URLSearchParams(window.location.search).get("t");
      let cleanupScroll: (() => void) | undefined;

      if (dbg !== null && !Number.isNaN(Number(dbg))) {
        render(Number(dbg));
        const onResize = () => render(Number(dbg));
        window.addEventListener("resize", onResize);
        cleanupScroll = () => window.removeEventListener("resize", onResize);
      } else {
        const proxy = { t: 0 };
        gsap.to(proxy, {
          t: TOTAL,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // short smoothing; Lenis already adds inertia
            invalidateOnRefresh: true,
          },
          onUpdate: () => render(proxy.t),
        });
        const onResize = () => render(proxy.t);
        window.addEventListener("resize", onResize);
        cleanupScroll = () => window.removeEventListener("resize", onResize);
      }

      let lenis: Lenis | null = null;
      let tick: ((time: number) => void) | null = null;
      if (smoothScroll) {
        lenis = new Lenis({ lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time: number) => lenis!.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      return () => {
        cleanupScroll?.();
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      style={{ height: `${SCROLL_VH}vh` }}
      className="relative bg-black"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-black text-white"
      >
        {/* The ring */}
        {IMAGES.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 overflow-hidden will-change-transform"
            style={{ width: `${IMG_W_VW}vw`, zIndex: i }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              draggable={false}
              className="h-full w-full select-none object-cover"
            />
          </div>
        ))}

        {/* Section 1 heading */}
        <div
          ref={h1Ref}
          className="pointer-events-none absolute left-[1.6vw] top-[45vh] z-[200] w-[58vw] will-change-transform"
        >
          <span className="absolute -top-[0.2vw] left-0 w-[4.5vw] text-[0.85vw] leading-[1.1]">
            People &amp; Process
          </span>
          <h2
            className="font-serif text-[5vw] leading-[1.08] tracking-[-0.01em]"
            style={{ textIndent: "6.2vw" }}
          >
            A studio shaped by clarity, trust, and a collective pursuit of
            thoughtful design.
          </h2>
        </div>

        {/* Section 2 heading (inside the ring) */}
        <div
          ref={h2Ref}
          className="pointer-events-none absolute inset-0 z-[200] flex flex-col items-center pt-[33vh] text-center will-change-transform"
        >
          <h2 className="font-sans text-[8.4vw] leading-[0.91]">
            2011 Year
            <br />
            of
            <br />
            Foundation
          </h2>
          <div className="mt-[7vh] flex gap-[5vw] text-[0.95vw] leading-[1.3] text-neutral-400">
            <p className="w-[17vw]">
              Design approach grounded in passive strategies, material logic,
              and environmental responsibility.
            </p>
            <p className="w-[17vw]">
              Lifecycle-focused architecture with efficient systems, sustainable
              choices, and long-term value.
            </p>
          </div>
        </div>

        {/* Section 3 stats: each row is positioned by the scroll keyframes */}
        <div className="pointer-events-none absolute inset-0 z-[200]">
          {STATS.map((st, i) => (
            <div
              key={st.value}
              ref={(el) => {
                statItemRefs.current[i] = el;
              }}
              className="absolute left-[53vw] top-0 w-[42vw] will-change-transform"
              style={{ visibility: "hidden" }}
            >
              <div className="font-sans text-[8vw] leading-none">{st.value}</div>
              <div className="ml-[6vw] mt-[1vh] w-[30vw] font-serif text-[5vw] leading-[1.02]">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////V3////////////////////////////////////


// "use client";

// /**
//  * ScrollRingGallery  (v3: one continuous ring, keyframed from the reference video)
//  *
//  * What the reference really does (measured by fitting circles to frames):
//  *   There is ONE ring of images the whole time. Nothing is "gathered" or "released".
//  *   Only the ring's centre, radius, image spacing, image size and spin change,
//  *   smoothly, as you scroll:
//  *
//  *     t=0-10   huge bowl (R=1.26W), centre above the screen, images upright, sliding left
//  *     t=11     ring contracts to a small circle (R=.31W) -> looks like a "V"
//  *     t=11-14  images spin 180deg and the ring expands (R=.53W) rising from the bottom
//  *     t=14-23  ring settles on the screen centre (R=.42W) as "2011 Year of Foundation" rises
//  *     t=23-37  ring scrolls up and shrinks to a tiny overlapping cluster
//  *     t=37-44  cluster expands into an arc on the left edge, stats scroll in on the right
//  *
//  * Every number lives in KEYS below (time = seconds of the reference video).
//  * Scroll position -> time is linear, and all values are smooth (monotone cubic)
//  * curves through the keys, so transitions are continuous and fully reversible.
//  *
//  * npm i gsap @gsap/react lenis
//  * /public/gallery/1.jpg ... 17.jpg
//  *
//  * Tuning: open the page with ?t=11.5 (any video second) to freeze the animation at
//  * that moment and compare with the same frame of the video. Edit KEYS, refresh.
//  */

// import { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import Lenis from "lenis";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// /* ------------------------------------------------------------------ */
// /* Content                                                             */
// /* ------------------------------------------------------------------ */

// const COUNT = 17;
// const IMAGE_FILES = 17;
// const IMAGES = Array.from(
//   { length: COUNT },
//   (_, i) => `/gallery/${(i % IMAGE_FILES) + 1}.jpg`,
// );

// const STATS = [
//   { value: "15+", label: "Years of experience" },
//   { value: "490+", label: "Completed projects" },
//   { value: "45+", label: "Professionals on the team" },
//   { value: "40K", label: "Total area covered" },
// ];

// const IMG_W_VW = 19.5; // width of an image at scale 1 (the bowl phase)
// const RING_STEP = 360 / COUNT; // spacing when the ring is complete
// const TOTAL = 57; // seconds of the reference video that we animate
// const VH_PER_SEC = 10; // scroll distance per second of video
// const SCROLL_VH = 100 + TOTAL * VH_PER_SEC;

// /* ------------------------------------------------------------------ */
// /* THE KEYFRAMES  (edit these to match the video)                      */
// /* ------------------------------------------------------------------ */
// /**
//  * t      video second
//  * cx,cy  circle centre as a fraction of stage width / height
//  * R      circle radius as a fraction of stage width
//  * step   degrees between neighbouring images along the circle
//  * sc     image scale (1 = IMG_W_VW wide)
//  * ar     image width / height
//  * phi    extra image rotation: -180 = upright at the bottom of the circle
//  *        (bowl phase), 0 = outward facing (ring phase, upside-down at bottom)
//  * rot    angle of image 0, clockwise from the top of the circle, in degrees
//  */
// type Key = {
//   t: number;
//   cx: number;
//   cy: number;
//   R: number;
//   step: number;
//   sc: number;
//   ar: number;
//   phi: number;
//   rot: number;
// };

// const S = RING_STEP;
// const KEYS: Key[] = [
//   // --- 1. bowl, sliding left and up with the page ---
//   {
//     t: 0,
//     cx: 0.55,
//     cy: -1.31,
//     R: 1.26,
//     step: 11,
//     sc: 1.0,
//     ar: 0.8,
//     phi: -180,
//     rot: 190,
//   },
//   {
//     t: 7,
//     cx: 0.2,
//     cy: -1.39,
//     R: 1.26,
//     step: 11,
//     sc: 1.0,
//     ar: 0.8,
//     phi: -180,
//     rot: 188,
//   },
//   {
//     t: 10.2,
//     cx: 0.16,
//     cy: -1.7,
//     R: 1.26,
//     step: 11,
//     sc: 1.0,
//     ar: 0.8,
//     phi: -180,
//     rot: 188,
//   },
//   // --- 2. ring contracts into the "V" ---
//   {
//     t: 11.2,
//     cx: 0.55,
//     cy: 0.31,
//     R: 0.31,
//     step: S,
//     sc: 0.92,
//     ar: 0.85,
//     phi: -180,
//     rot: 263,
//   },
//   // --- 3. images spin round, ring expands upward from the bottom ---
//   {
//     t: 13.6,
//     cx: 0.26,
//     cy: 1.1,
//     R: 0.5,
//     step: S,
//     sc: 0.72,
//     ar: 1.0,
//     phi: 0,
//     rot: 395,
//   },
//   {
//     t: 14,
//     cx: 0.2,
//     cy: 1.17,
//     R: 0.53,
//     step: S,
//     sc: 0.7,
//     ar: 1.0,
//     phi: 0,
//     rot: 413,
//   },
//   {
//     t: 17,
//     cx: 0.38,
//     cy: 0.9,
//     R: 0.47,
//     step: S,
//     sc: 0.62,
//     ar: 1.0,
//     phi: 0,
//     rot: 440,
//   },
//   // --- 4. ring centred, text rises inside it ---
//   {
//     t: 22,
//     cx: 0.5,
//     cy: 0.45,
//     R: 0.42,
//     step: S,
//     sc: 0.6,
//     ar: 1.0,
//     phi: 0,
//     rot: 452,
//   },
//   {
//     t: 23.5,
//     cx: 0.5,
//     cy: 0.4,
//     R: 0.42,
//     step: S,
//     sc: 0.6,
//     ar: 1.0,
//     phi: 0,
//     rot: 454,
//   },
//   // --- 5. ring scrolls up, then shrinks into a tight cluster ---
//   {
//     t: 28,
//     cx: 0.5,
//     cy: -0.105,
//     R: 0.41,
//     step: S,
//     sc: 0.6,
//     ar: 1.0,
//     phi: 0,
//     rot: 462,
//   },
//   {
//     t: 31,
//     cx: 0.445,
//     cy: -0.05,
//     R: 0.37,
//     step: S,
//     sc: 0.6,
//     ar: 1.0,
//     phi: 0,
//     rot: 470,
//   },
//   {
//     t: 35,
//     cx: 0.51,
//     cy: -0.12,
//     R: 0.3,
//     step: S,
//     sc: 0.58,
//     ar: 1.0,
//     phi: 0,
//     rot: 490,
//   },
//   {
//     t: 36,
//     cx: 0.45,
//     cy: 0.1,
//     R: 0.23,
//     step: S,
//     sc: 0.56,
//     ar: 1.0,
//     phi: 0,
//     rot: 497,
//   },
//   {
//     t: 37,
//     cx: 0.28,
//     cy: 0.56,
//     R: 0.09,
//     step: S,
//     sc: 0.5,
//     ar: 1.0,
//     phi: 0,
//     rot: 505,
//   },
//   {
//     t: 38,
//     cx: 0.23,
//     cy: 0.68,
//     R: 0.08,
//     step: S,
//     sc: 0.5,
//     ar: 1.0,
//     phi: 0,
//     rot: 512,
//   },
//   // --- 6. cluster expands into the arc on the left edge ---
//   {
//     t: 40,
//     cx: 0.0,
//     cy: 1.0,
//     R: 0.3,
//     step: S,
//     sc: 0.58,
//     ar: 1.0,
//     phi: 0,
//     rot: 528,
//   },
//   {
//     t: 44,
//     cx: -0.052,
//     cy: 1.028,
//     R: 0.497,
//     step: S,
//     sc: 0.66,
//     ar: 1.0,
//     phi: 0,
//     rot: 548,
//   },
//   {
//     t: 50,
//     cx: 0.007,
//     cy: 0.161,
//     R: 0.408,
//     step: S,
//     sc: 0.66,
//     ar: 1.0,
//     phi: 0,
//     rot: 575,
//   },
//   {
//     t: 57,
//     cx: 0.0,
//     cy: -0.45,
//     R: 0.41,
//     step: S,
//     sc: 0.66,
//     ar: 1.0,
//     phi: 0,
//     rot: 600,
//   },
// ];

// /** Text blocks scroll like normal page content: [t, translateY in vh] */
// const H1_Y: [number, number][] = [
//   [0, 0],
//   [7, -35],
//   [9, -55],
//   [11.2, -90],
// ];
// const H2_Y: [number, number][] = [
//   [15.5, 62],
//   [23, 0],
//   [23.6, 0],
//   [28, -67],
//   [31, -95],
// ];
// /** y of the top of the first stats row, in vh. Rows are STAT_ROW_VH apart. */
// const STATS_Y: [number, number][] = [
//   [33, 100],
//   [34.3, 92.5],
//   [44, 7.5],
//   [46, -19.5],
//   [48, -38],
//   [50, -71.5],
//   [52, -103.5],
//   [54, -132],
//   [57, -165],
// ];
// const STAT_ROW_VH = 47;
// const STAT_FOCUS_VH = 40; // row centre that is fully lit, in vh from the top

// /* ------------------------------------------------------------------ */
// /* Math                                                                */
// /* ------------------------------------------------------------------ */

// const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// /** Monotone cubic (Fritsch-Carlson) interpolation: smooth, no overshoot. */
// function pchip(ts: number[], vs: number[]) {
//   const n = ts.length;
//   const h: number[] = [];
//   const d: number[] = [];
//   for (let i = 0; i < n - 1; i++) {
//     h[i] = ts[i + 1] - ts[i];
//     d[i] = (vs[i + 1] - vs[i]) / h[i];
//   }
//   const m: number[] = new Array(n);
//   m[0] = d[0];
//   m[n - 1] = d[n - 2];
//   for (let i = 1; i < n - 1; i++) {
//     if (d[i - 1] * d[i] <= 0) m[i] = 0;
//     else {
//       const w1 = 2 * h[i] + h[i - 1];
//       const w2 = h[i] + 2 * h[i - 1];
//       m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
//     }
//   }
//   return (t: number) => {
//     const x = clamp(t, ts[0], ts[n - 1]);
//     let i = 0;
//     while (i < n - 2 && x > ts[i + 1]) i++;
//     const u = (x - ts[i]) / h[i];
//     const u2 = u * u;
//     const u3 = u2 * u;
//     return (
//       (2 * u3 - 3 * u2 + 1) * vs[i] +
//       (u3 - 2 * u2 + u) * h[i] * m[i] +
//       (-2 * u3 + 3 * u2) * vs[i + 1] +
//       (u3 - u2) * h[i] * m[i + 1]
//     );
//   };
// }

// function linear(pts: [number, number][]) {
//   return (t: number) => {
//     if (t <= pts[0][0]) return pts[0][1];
//     for (let i = 0; i < pts.length - 1; i++) {
//       const [t0, v0] = pts[i];
//       const [t1, v1] = pts[i + 1];
//       if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
//     }
//     return pts[pts.length - 1][1];
//   };
// }

// const ts = KEYS.map((k) => k.t);
// const f = {
//   cx: pchip(
//     ts,
//     KEYS.map((k) => k.cx),
//   ),
//   cy: pchip(
//     ts,
//     KEYS.map((k) => k.cy),
//   ),
//   R: pchip(
//     ts,
//     KEYS.map((k) => k.R),
//   ),
//   step: pchip(
//     ts,
//     KEYS.map((k) => k.step),
//   ),
//   sc: pchip(
//     ts,
//     KEYS.map((k) => k.sc),
//   ),
//   ar: pchip(
//     ts,
//     KEYS.map((k) => k.ar),
//   ),
//   phi: pchip(
//     ts,
//     KEYS.map((k) => k.phi),
//   ),
//   rot: pchip(
//     ts,
//     KEYS.map((k) => k.rot),
//   ),
// };
// const h1y = linear(H1_Y);
// const h2y = linear(H2_Y);
// const statsY = linear(STATS_Y);

// /* ------------------------------------------------------------------ */
// /* Component                                                           */
// /* ------------------------------------------------------------------ */

// export default function ScrollRingGallery({
//   smoothScroll = true,
// }: {
//   smoothScroll?: boolean;
// }) {
//   const wrapRef = useRef<HTMLDivElement>(null);
//   const stageRef = useRef<HTMLDivElement>(null);
//   const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const h1Ref = useRef<HTMLDivElement>(null);
//   const h2Ref = useRef<HTMLDivElement>(null);
//   const statItemRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useGSAP(
//     () => {
//       const stage = stageRef.current!;
//       const imgs = imgRefs.current.filter(Boolean) as HTMLDivElement[];
//       const rows = statItemRefs.current.filter(Boolean) as HTMLDivElement[];
//       const h1 = h1Ref.current!;
//       const h2 = h2Ref.current!;

//       const render = (t: number) => {
//         const W = stage.clientWidth;
//         const H = stage.clientHeight;
//         const vh = H / 100;

//         const cx = f.cx(t) * W;
//         const cy = f.cy(t) * H;
//         const R = f.R(t) * W;
//         const step = f.step(t);
//         const sc = f.sc(t);
//         const ar = f.ar(t);
//         const phi = f.phi(t);
//         const rot = f.rot(t);
//         const w = (W * IMG_W_VW) / 100;

//         for (let i = 0; i < imgs.length; i++) {
//           const th = rot - i * step; // degrees clockwise from the top
//           const rad = (th * Math.PI) / 180;
//           const x = cx + R * Math.sin(rad);
//           const y = cy - R * Math.cos(rad);
//           const el = imgs[i];
//           el.style.height = `${w / ar}px`;
//           el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${th + phi}deg) scale(${sc})`;
//         }

//         // Section 1 heading: scrolls away like page content
//         const y1 = h1y(t);
//         h1.style.transform = `translate3d(0,${y1}vh,0)`;
//         h1.style.visibility = y1 < -88 ? "hidden" : "visible";

//         // Section 2 heading: rises from below, then scrolls off the top
//         const y2 = h2y(t);
//         h2.style.transform = `translate3d(0,${y2}vh,0)`;
//         h2.style.visibility = t < 15.4 || y2 < -94 ? "hidden" : "visible";

//         // Stats: plain scrolling list; rows light up near the focus line
//         const top0 = statsY(t);
//         rows.forEach((el, i) => {
//           const top = top0 + i * STAT_ROW_VH;
//           const centre = top + 9; // visual centre of value + label
//           const d = Math.abs(centre - STAT_FOCUS_VH) / 100;
//           el.style.transform = `translate3d(0,${top * vh}px,0)`;
//           el.style.opacity = String(clamp(1 - 3.6 * d, 0.12, 1));
//           el.style.visibility = t < 33 ? "hidden" : "visible";
//         });
//       };

//       render(0);

//       // Debug: ?t=12.5 freezes the animation at that video second.
//       const dbg = new URLSearchParams(window.location.search).get("t");
//       let cleanupScroll: (() => void) | undefined;

//       if (dbg !== null && !Number.isNaN(Number(dbg))) {
//         render(Number(dbg));
//         const onResize = () => render(Number(dbg));
//         window.addEventListener("resize", onResize);
//         cleanupScroll = () => window.removeEventListener("resize", onResize);
//       } else {
//         const proxy = { t: 0 };
//         gsap.to(proxy, {
//           t: TOTAL,
//           ease: "none",
//           scrollTrigger: {
//             trigger: wrapRef.current,
//             start: "top top",
//             end: "bottom bottom",
//             scrub: 0.5, // short smoothing; Lenis already adds inertia
//             invalidateOnRefresh: true,
//           },
//           onUpdate: () => render(proxy.t),
//         });
//         const onResize = () => render(proxy.t);
//         window.addEventListener("resize", onResize);
//         cleanupScroll = () => window.removeEventListener("resize", onResize);
//       }

//       let lenis: Lenis | null = null;
//       let tick: ((time: number) => void) | null = null;
//       if (smoothScroll) {
//         lenis = new Lenis({ lerp: 0.1 });
//         lenis.on("scroll", ScrollTrigger.update);
//         tick = (time: number) => lenis!.raf(time * 1000);
//         gsap.ticker.add(tick);
//         gsap.ticker.lagSmoothing(0);
//       }

//       return () => {
//         cleanupScroll?.();
//         if (tick) gsap.ticker.remove(tick);
//         lenis?.destroy();
//       };
//     },
//     { scope: wrapRef },
//   );

//   return (
//     <div
//       ref={wrapRef}
//       style={{ height: `${SCROLL_VH}vh` }}
//       className="relative bg-black"
//     >
//       <div
//         ref={stageRef}
//         className="sticky top-0 h-screen w-full overflow-hidden bg-black text-white"
//       >
//         {/* The ring */}
//         {IMAGES.map((src, i) => (
//           <div
//             key={i}
//             ref={(el) => {
//               imgRefs.current[i] = el;
//             }}
//             className="absolute left-0 top-0 overflow-hidden will-change-transform"
//             style={{ width: `${IMG_W_VW}vw`, zIndex: i }}
//           >
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={src}
//               alt=""
//               draggable={false}
//               className="h-full w-full select-none object-cover"
//             />
//           </div>
//         ))}

//         {/* Section 1 heading */}
//         <div
//           ref={h1Ref}
//           className="pointer-events-none absolute left-[1.6vw] top-[45vh] z-[200] w-[58vw] will-change-transform"
//         >
//           <span className="absolute -top-[0.2vw] left-0 w-[4.5vw] text-[0.85vw] leading-[1.1]">
//             People &amp; Process
//           </span>
//           <h2
//             className="font-serif text-[5vw] leading-[1.08] tracking-[-0.01em]"
//             style={{ textIndent: "6.2vw" }}
//           >
//             A studio shaped by clarity, trust, and a collective pursuit of
//             thoughtful design.
//           </h2>
//         </div>

//         {/* Section 2 heading (inside the ring) */}
//         <div
//           ref={h2Ref}
//           className="pointer-events-none absolute inset-0 z-[200] flex flex-col items-center pt-[33vh] text-center will-change-transform"
//         >
//           <h2 className="font-sans text-[8.4vw] leading-[0.91]">
//             2011 Year
//             <br />
//             of
//             <br />
//             Foundation
//           </h2>
//           <div className="mt-[7vh] flex gap-[5vw] text-[0.95vw] leading-[1.3] text-neutral-400">
//             <p className="w-[17vw]">
//               Design approach grounded in passive strategies, material logic,
//               and environmental responsibility.
//             </p>
//             <p className="w-[17vw]">
//               Lifecycle-focused architecture with efficient systems, sustainable
//               choices, and long-term value.
//             </p>
//           </div>
//         </div>

//         {/* Section 3 stats: each row is positioned by the scroll keyframes */}
//         <div className="pointer-events-none absolute inset-0 z-[200]">
//           {STATS.map((st, i) => (
//             <div
//               key={st.value}
//               ref={(el) => {
//                 statItemRefs.current[i] = el;
//               }}
//               className="absolute left-[53vw] top-0 w-[42vw] will-change-transform"
//               style={{ visibility: "hidden" }}
//             >
//               <div className="font-sans text-[8vw] leading-none">
//                 {st.value}
//               </div>
//               <div className="ml-[6vw] mt-[1vh] w-[30vw] font-serif text-[5vw] leading-[1.02]">
//                 {st.label}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



/////////////////////////////////////////V2//////////////////////////////////
// "use client";

// /**
//  * ScrollRingGallery  (v2: gather -> release choreography)
//  *
//  * Behaviour measured from the reference video:
//  *   1. ARC   images sit on a big bowl-shaped arc (upright, tops facing the arc centre)
//  *   2. they GATHER into a loose, randomly rotated pile at the bottom
//  *   3. they are RELEASED from the pile one by one and fly into a full RING
//  *      (outward-facing, so images at the bottom are upside-down); text rises in the middle
//  *   4. the ring scrolls up and away, images GATHER into a second pile (bottom-left)
//  *   5. they are RELEASED one by one into a SIDE arc on the left, stats list on the right
//  *
//  * Everything is a pure function of one number: scroll progress `p` (0..TOTAL).
//  * That keeps scrolling backwards perfectly reversible.
//  *
//  * npm i gsap @gsap/react lenis
//  * /public/gallery/1.jpg ... 17.jpg
//  */

// import { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import Lenis from "lenis";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// /* ------------------------------------------------------------------ */
// /* Content                                                             */
// /* ------------------------------------------------------------------ */

// const COUNT = 17; // number of images on the circle
// const IMAGE_FILES = 17; // how many files exist in /public/gallery
// const IMAGES = Array.from(
//   { length: COUNT },
//   (_, i) => `/gallery/${(i % IMAGE_FILES) + 1}.jpg`,
// );

// const STATS = [
//   { value: "15+", label: "Years of experience" },
//   { value: "490+", label: "Completed projects" },
//   { value: "45+", label: "Professionals on the team" },
//   { value: "40K", label: "Total area covered" },
// ];

// /* ------------------------------------------------------------------ */
// /* Tuning knobs (all measured from the 1280x720 reference frames)      */
// /* ------------------------------------------------------------------ */

// // Base image width in vw. The arc uses scale 1, the others scale down.
// const IMG_W_VW = 19.5;
// const IMG_ASPECT = "4 / 5";

// // 1) ARC  - bottom of a huge circle whose centre is above the screen.
// const ARC = { cx: 0.2, cy: -1.39, R: 1.26, step: 11, startDeg: 186, scale: 1 };
// const ARC_VISIBLE_MAX = 8; // images beyond this index wait off-screen top-right

// // 2) PILES - where images gather. x/y are fractions of W / H.
// const PILE_A = { x: 0.6, y: 0.92, spread: 0.14, scale: 0.8 };
// const PILE_B = { x: 0.26, y: 0.86, spread: 0.14, scale: 0.6 };

// // 3) RING - full circle centred on the screen (cy animates up and away).
// const RING = { cx: 0.5, cy: 0.5, R: 0.42, scale: 0.6 };

// // 4) SIDE - circle pushed against the left edge.
// const SIDE = { cx: 0.02, cy: 0.5, R: 0.44, scale: 0.66 };

// const STEP = 360 / COUNT; // degrees between images on RING / SIDE
// const ROT_PER_UNIT = 14; // ring spin speed (deg per timeline unit)

// // Timeline, in abstract units. Total scroll length is derived from TOTAL.
// const T = {
//   arcDrift: 3.0,
//   textOutStart: 0.6,
//   textOutEnd: 3.4,

//   gatherA: { start: 1.8, stagger: 0.07, dur: 1.2 },
//   releaseRing: { start: 3.9, stagger: 0.09, dur: 1.2 },
//   text2In: [4.8, 6.6],

//   ringUp: [7.4, 8.8],
//   text2Out: [7.4, 8.8],

//   gatherB: { start: 8.2, stagger: 0.05, dur: 1.1 },
//   releaseSide: { start: 10.3, stagger: 0.08, dur: 1.1 },

//   statsIn: [9.4, 11.0],
//   statsStep: [11.2, 16.0],
// };
// const TOTAL = 17;
// const SCROLL_VH = TOTAL * 60 + 100; // wrapper height

// /* ------------------------------------------------------------------ */
// /* Math helpers                                                        */
// /* ------------------------------------------------------------------ */

// type Pt = { x: number; y: number; r: number; s: number };

// const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
// const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
// const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
// const easeIO = (t: number) =>
//   t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// const rnd = (i: number, k: number) => {
//   const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
//   return v - Math.floor(v);
// };
// const mix = (a: Pt, b: Pt, t: number): Pt => ({
//   x: lerp(a.x, b.x, t),
//   y: lerp(a.y, b.y, t),
//   s: lerp(a.s, b.s, t),
//   r: a.r + wrap180(b.r - a.r) * t,
// });

// // Rank images by how close their angle is to a target angle (0 = first).
// const rankBy = (angleOf: (i: number) => number) => {
//   const order = Array.from({ length: COUNT }, (_, i) => i).sort(
//     (a, b) => Math.abs(wrap180(angleOf(a))) - Math.abs(wrap180(angleOf(b))),
//   );
//   const rank: number[] = [];
//   order.forEach((img, r) => (rank[img] = r));
//   return rank;
// };

// // Ring fills from the top; side arc grows from the bottom (where the pile is).
// const RANK_RING = rankBy((i) => i * STEP + T.releaseRing.start * ROT_PER_UNIT);
// const RANK_SIDE = rankBy(
//   (i) => i * STEP + T.releaseSide.start * ROT_PER_UNIT + 180,
// );

// /* ------------------------------------------------------------------ */
// /* Component                                                           */
// /* ------------------------------------------------------------------ */

// export default function ScrollRingGallery({
//   smoothScroll = true,
// }: {
//   smoothScroll?: boolean;
// }) {
//   const wrapRef = useRef<HTMLDivElement>(null);
//   const stageRef = useRef<HTMLDivElement>(null);
//   const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const h1Ref = useRef<HTMLDivElement>(null);
//   const h2Ref = useRef<HTMLDivElement>(null);
//   const statsRef = useRef<HTMLDivElement>(null);
//   const statItemRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useGSAP(
//     () => {
//       const stage = stageRef.current!;
//       const imgs = imgRefs.current.filter(Boolean) as HTMLDivElement[];
//       const items = statItemRefs.current.filter(Boolean) as HTMLDivElement[];
//       const h1 = h1Ref.current!;
//       const h2 = h2Ref.current!;
//       const stats = statsRef.current!;

//       // Random-but-stable pile layout (offsets in W/H fractions + rotation).
//       const pile = imgs.map((_, i) => ({
//         ax: (rnd(i, 1) - 0.5) * PILE_A.spread,
//         ay: (rnd(i, 2) - 0.5) * PILE_A.spread * 0.7,
//         ar: (rnd(i, 3) - 0.5) * 80,
//         as: 0.9 + rnd(i, 4) * 0.2,
//         bx: (rnd(i, 5) - 0.5) * PILE_B.spread,
//         by: (rnd(i, 6) - 0.5) * PILE_B.spread * 0.7,
//         br: (rnd(i, 7) - 0.5) * 80,
//         bs: 0.9 + rnd(i, 8) * 0.2,
//       }));
//       imgs.forEach(
//         (el, i) => (el.style.zIndex = String(Math.round(rnd(i, 9) * 100))),
//       );

//       const render = (p: number) => {
//         const W = stage.clientWidth;
//         const H = stage.clientHeight;
//         const vh = H / 100;

//         const rot = p * ROT_PER_UNIT;
//         const arcShift = Math.min(p, T.arcDrift) * 9;
//         const cyRing = lerp(
//           RING.cy,
//           -0.12,
//           easeIO(seg(p, T.ringUp[0], T.ringUp[1])),
//         );

//         for (let i = 0; i < imgs.length; i++) {
//           /* ---- the four slots an image can occupy ---- */
//           const ia = Math.min(i, ARC_VISIBLE_MAX);
//           const ta = ARC.startDeg - ia * ARC.step + arcShift;
//           const ra = (ta * Math.PI) / 180;
//           const A: Pt = {
//             x: ARC.cx * W + ARC.R * W * Math.sin(ra),
//             y: ARC.cy * H - ARC.R * W * Math.cos(ra),
//             r: ta - 180, // upright at the bottom of the bowl
//             s: ARC.scale,
//           };

//           const tr = i * STEP + rot;
//           const rr = (tr * Math.PI) / 180;
//           const R: Pt = {
//             x: RING.cx * W + RING.R * W * Math.sin(rr),
//             y: cyRing * H - RING.R * W * Math.cos(rr),
//             r: tr,
//             s: RING.scale,
//           };

//           const S: Pt = {
//             x: SIDE.cx * W + SIDE.R * W * Math.sin(rr),
//             y: SIDE.cy * H - SIDE.R * W * Math.cos(rr),
//             r: tr,
//             s: SIDE.scale,
//           };

//           const pa = pile[i];
//           const PA: Pt = {
//             x: PILE_A.x * W + pa.ax * W,
//             y: PILE_A.y * H + pa.ay * W,
//             r: pa.ar,
//             s: PILE_A.scale * pa.as,
//           };
//           const PB: Pt = {
//             x: PILE_B.x * W + pa.bx * W,
//             y: PILE_B.y * H + pa.by * W,
//             r: pa.br,
//             s: PILE_B.scale * pa.bs,
//           };

//           /* ---- progress of each hop (staggered per image) ---- */
//           const g1s = T.gatherA.start + i * T.gatherA.stagger;
//           const g1 = easeIO(seg(p, g1s, g1s + T.gatherA.dur));

//           const q1s =
//             T.releaseRing.start + RANK_RING[i] * T.releaseRing.stagger;
//           const q1 = easeOut(seg(p, q1s, q1s + T.releaseRing.dur));

//           const g2s = T.gatherB.start + i * T.gatherB.stagger;
//           const g2 = easeIO(seg(p, g2s, g2s + T.gatherB.dur));

//           const q2s =
//             T.releaseSide.start + RANK_SIDE[i] * T.releaseSide.stagger;
//           const q2 = easeOut(seg(p, q2s, q2s + T.releaseSide.dur));

//           let pt: Pt;
//           if (q2 > 0) pt = mix(PB, S, q2);
//           else if (g2 > 0) pt = mix(R, PB, g2);
//           else if (q1 > 0) pt = mix(PA, R, q1);
//           else if (g1 > 0) pt = mix(A, PA, g1);
//           else pt = A;

//           imgs[i].style.transform =
//             `translate3d(${pt.x}px,${pt.y}px,0) translate(-50%,-50%) rotate(${pt.r}deg) scale(${pt.s})`;
//         }

//         /* ---- text 1: scrolls up like normal page content ---- */
//         const t1 = easeIO(seg(p, T.textOutStart, T.textOutEnd));
//         h1.style.transform = `translate3d(0,${-t1 * 130}vh,0)`;
//         h1.style.visibility = t1 >= 1 ? "hidden" : "visible";

//         /* ---- text 2: rises from below, then scrolls away with the ring ---- */
//         const in2 = easeOut(seg(p, T.text2In[0], T.text2In[1]));
//         const out2 = easeIO(seg(p, T.text2Out[0], T.text2Out[1]));
//         h2.style.transform = `translate3d(0,${(1 - in2) * 100 - out2 * 100}vh,0)`;
//         h2.style.opacity = String(in2 * (1 - out2));
//         h2.style.visibility = in2 === 0 || out2 >= 1 ? "hidden" : "visible";

//         /* ---- stats: rise in, then step through the rows ---- */
//         const inS = easeOut(seg(p, T.statsIn[0], T.statsIn[1]));
//         const active =
//           seg(p, T.statsStep[0], T.statsStep[1]) * (items.length - 1);
//         const rowH = items[0]?.offsetHeight ?? 0;
//         stats.style.transform = `translate3d(0,${
//           (1 - inS) * 70 * vh - (active + 0.5) * rowH
//         }px,0)`;
//         stats.style.visibility = inS === 0 ? "hidden" : "visible";
//         items.forEach((el, i) => {
//           el.style.opacity = String(
//             inS * clamp(1 - Math.abs(active - i) * 0.85, 0.12, 1),
//           );
//         });
//       };

//       render(0);

//       /* ---- one scrubbed tween drives the whole thing ---- */
//       const proxy = { p: 0 };
//       gsap.to(proxy, {
//         p: TOTAL,
//         ease: "none",
//         scrollTrigger: {
//           trigger: wrapRef.current,
//           start: "top top",
//           end: "bottom bottom",
//           scrub: 0.8, // inertia between scroll and animation
//           invalidateOnRefresh: true,
//         },
//         onUpdate: () => render(proxy.p),
//       });

//       /* ---- optional Lenis smooth scrolling ---- */
//       let lenis: Lenis | null = null;
//       let tick: ((t: number) => void) | null = null;
//       if (smoothScroll) {
//         lenis = new Lenis({ lerp: 0.1 });
//         lenis.on("scroll", ScrollTrigger.update);
//         tick = (t: number) => lenis!.raf(t * 1000);
//         gsap.ticker.add(tick);
//         gsap.ticker.lagSmoothing(0);
//       }

//       const onResize = () => render(proxy.p);
//       window.addEventListener("resize", onResize);

//       return () => {
//         window.removeEventListener("resize", onResize);
//         if (tick) gsap.ticker.remove(tick);
//         lenis?.destroy();
//       };
//     },
//     { scope: wrapRef },
//   );

//   return (
//     <div
//       ref={wrapRef}
//       style={{ height: `${SCROLL_VH}vh` }}
//       className="relative bg-black"
//     >
//       <div
//         ref={stageRef}
//         className="sticky top-0 h-screen w-full overflow-hidden bg-black text-white"
//       >
//         {/* Images */}
//         {IMAGES.map((src, i) => (
//           <div
//             key={i}
//             ref={(el) => {
//               imgRefs.current[i] = el;
//             }}
//             className="absolute left-0 top-0 will-change-transform"
//             style={{ width: `${IMG_W_VW}vw`, aspectRatio: IMG_ASPECT }}
//           >
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={src}
//               alt=""
//               draggable={false}
//               className="h-full w-full select-none object-cover"
//             />
//           </div>
//         ))}

//         {/* Section 1 text */}
//         <div
//           ref={h1Ref}
//           className="pointer-events-none absolute left-[1.6vw] top-[40vh] z-[200] w-[58vw] will-change-transform"
//         >
//           <span className="absolute -top-[0.2vw] left-0 w-[4.5vw] text-[0.85vw] leading-[1.1]">
//             People &amp; Process
//           </span>
//           <h2
//             className="font-serif text-[5vw] leading-[1.08] tracking-[-0.01em]"
//             style={{ textIndent: "6.2vw" }}
//           >
//             A studio shaped by clarity, trust, and a collective pursuit of
//             thoughtful design.
//           </h2>
//         </div>

//         {/* Section 2 text */}
//         <div
//           ref={h2Ref}
//           className="pointer-events-none absolute inset-0 z-[200] flex flex-col items-center pt-[33vh] text-center will-change-transform"
//         >
//           <h2 className="font-sans text-[8.4vw] leading-[0.91]">
//             2011 Year
//             <br />
//             of
//             <br />
//             Foundation
//           </h2>
//           <div className="mt-[7vh] flex gap-[5vw] text-[0.95vw] leading-[1.3] text-neutral-400">
//             <p className="w-[17vw]">
//               Design approach grounded in passive strategies, material logic,
//               and environmental responsibility.
//             </p>
//             <p className="w-[17vw]">
//               Lifecycle-focused architecture with efficient systems, sustainable
//               choices, and long-term value.
//             </p>
//           </div>
//         </div>

//         {/* Section 3 stats: list is centred on the active row */}
//         <div className="pointer-events-none absolute left-[53vw] top-1/2 z-[200] w-[42vw]">
//           <div ref={statsRef} className="will-change-transform">
//             {STATS.map((st, i) => (
//               <div
//                 key={st.value}
//                 ref={(el) => {
//                   statItemRefs.current[i] = el;
//                 }}
//                 className="h-[46vh]"
//               >
//                 <div className="font-sans text-[8vw] leading-none">
//                   {st.value}
//                 </div>
//                 <div className="ml-[6vw] mt-[1vh] w-[30vw] font-serif text-[5vw] leading-[1.02]">
//                   {st.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
