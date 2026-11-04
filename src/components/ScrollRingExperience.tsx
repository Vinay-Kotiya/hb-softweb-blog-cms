// "use client";

// import { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// const DURATION = 59;
// const DESKTOP_CARD_COUNT = 24;
// const MOBILE_CARD_COUNT = 12;

// /**
//  * Replace these demo URLs with the 24 original portfolio/gallery images.
//  * Local paths such as /gallery/01.webp are recommended for production.
//  */
// const DEFAULT_IMAGES = [
//   "photo-1524758631624-e2822e304c36",
//   "photo-1497366216548-37526070297c",
//   "photo-1497366754035-f200968a6e72",
//   "photo-1521737711867-e3b97375f902",
//   "photo-1556761175-b413da4baf72",
//   "photo-1522071820081-009f0129c71c",
//   "photo-1552664730-d307ca884978",
//   "photo-1517245386807-bb43f82c33c4",
//   "photo-1497366811353-6870744d04b2",
//   "photo-1556761175-4b46a572b786",
//   "photo-1528605248644-14dd04022da1",
//   "photo-1516321318423-f06f85e504b3",
//   "photo-1553877522-43269d4ea984",
//   "photo-1542744173-8e7e53415bb0",
//   "photo-1560472354-b33ff0c44a43",
//   "photo-1531482615713-2afd69097998",
//   "photo-1551836022-d5d88e9218df",
//   "photo-1556761175-5973dc0f32e7",
//   "photo-1521737711867-e3b97375f902",
//   "photo-1552664730-d307ca884978",
//   "photo-1517245386807-bb43f82c33c4",
//   "photo-1556761175-4b46a572b786",
//   "photo-1497366216548-37526070297c",
//   "photo-1524758631624-e2822e304c36",
// ].map(
//   (id) =>
//     `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`,
// );

// type MotionKeyframe = {
//   time: number;
//   cx: number;
//   cy: number;
//   radius: number;
//   card: number;
//   spin: number;
// };

// /**
//  * Values are normalized to viewport width/height. The orbit centre is allowed
//  * to sit outside the viewport; this is what creates the large opening bowl and
//  * the final left-edge orbit without hiding/repositioning the cards abruptly.
//  */
// const DESKTOP_MOTION: MotionKeyframe[] = [
//   { time: 0, cx: 0.09, cy: -1.40, radius: 1.31, card: 0.148, spin: -1 },
//   { time: 8, cx: 0.09, cy: -1.40, radius: 1.31, card: 0.148, spin: 8 },
//   { time: 12, cx: 0.28, cy: -0.08, radius: 0.90, card: 0.136, spin: 38 },
//   { time: 16, cx: 0.50, cy: 0.50, radius: 0.46, card: 0.118, spin: 72 },
//   { time: 21, cx: 0.50, cy: 0.50, radius: 0.36, card: 0.112, spin: 91 },
//   { time: 26, cx: 0.50, cy: 0.50, radius: 0.36, card: 0.112, spin: 108 },
//   { time: 32, cx: 0.50, cy: -0.34, radius: 0.50, card: 0.119, spin: 144 },
//   { time: 37, cx: 0.60, cy: -0.16, radius: 0.60, card: 0.124, spin: 181 },
//   { time: 42, cx: 0.78, cy: 0.50, radius: 0.60, card: 0.126, spin: 214 },
//   { time: 57, cx: 0.78, cy: 0.50, radius: 0.60, card: 0.126, spin: 254 },
//   { time: 59, cx: 0.78, cy: 0.50, radius: 0.60, card: 0.126, spin: 260 },
// ];

// const MOBILE_MOTION: MotionKeyframe[] = [
//   { time: 0, cx: 0.08, cy: -1.14, radius: 1.23, card: 0.145, spin: -1 },
//   { time: 8, cx: 0.08, cy: -1.14, radius: 1.23, card: 0.145, spin: 8 },
//   { time: 12, cx: 0.30, cy: -0.05, radius: 0.78, card: 0.132, spin: 38 },
//   { time: 16, cx: 0.50, cy: 0.50, radius: 0.48, card: 0.126, spin: 72 },
//   { time: 21, cx: 0.50, cy: 0.50, radius: 0.42, card: 0.12, spin: 91 },
//   { time: 26, cx: 0.50, cy: 0.50, radius: 0.42, card: 0.12, spin: 108 },
//   { time: 32, cx: 0.50, cy: -0.30, radius: 0.54, card: 0.126, spin: 144 },
//   { time: 37, cx: 0.60, cy: -0.12, radius: 0.62, card: 0.13, spin: 181 },
//   { time: 42, cx: 0.78, cy: 0.50, radius: 0.58, card: 0.132, spin: 214 },
//   { time: 57, cx: 0.78, cy: 0.50, radius: 0.58, card: 0.132, spin: 254 },
//   { time: 59, cx: 0.78, cy: 0.50, radius: 0.58, card: 0.132, spin: 260 },
// ];

// const METRICS = [
//   { number: "15+", label: "Years of experience" },
//   { number: "490+", label: "Completed projects" },
//   { number: "45+", label: "Professionals on the team" },
//   { number: "40K", label: "Total area covered" },
// ];

// function clamp(value: number, min: number, max: number) {
//   return Math.min(max, Math.max(min, value));
// }

// function smoothstep(edge0: number, edge1: number, value: number) {
//   const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
//   return t * t * (3 - 2 * t);
// }

// /** Catmull-Rom interpolation keeps velocity continuous across motion keys. */
// function sampleMotion(
//   time: number,
//   frames: MotionKeyframe[],
// ): Omit<MotionKeyframe, "time"> {
//   let segment = 0;
//   while (
//     segment < frames.length - 2 &&
//     time > frames[segment + 1].time
//   ) {
//     segment += 1;
//   }

//   const p0 = frames[Math.max(0, segment - 1)];
//   const p1 = frames[segment];
//   const p2 = frames[segment + 1];
//   const p3 = frames[Math.min(frames.length - 1, segment + 2)];
//   const span = p2.time - p1.time || 1;
//   const t = clamp((time - p1.time) / span, 0, 1);
//   const t2 = t * t;
//   const t3 = t2 * t;

//   const interpolate = (key: keyof Omit<MotionKeyframe, "time">) => {
//     const m1 = ((p2[key] - p0[key]) / (p2.time - p0.time || 1)) * span;
//     const m2 = ((p3[key] - p1[key]) / (p3.time - p1.time || 1)) * span;
//     return (
//       (2 * t3 - 3 * t2 + 1) * p1[key] +
//       (t3 - 2 * t2 + t) * m1 +
//       (-2 * t3 + 3 * t2) * p2[key] +
//       (t3 - t2) * m2
//     );
//   };

//   return {
//     cx: interpolate("cx"),
//     cy: interpolate("cy"),
//     radius: interpolate("radius"),
//     card: interpolate("card"),
//     spin: interpolate("spin"),
//   };
// }

// function makeImageUrl(path: string) {
//   return path.startsWith("http") ? path : path;
// }

// type ScrollRingExperienceProps = {
//   /** Pass 24 local image URLs in the order you want them to orbit. */
//   images?: string[];
//   /** Set false when your app already has a global smooth-scroll provider. */
//   showReferenceNav?: boolean;
// };

// export function ScrollRingExperience({
//   images = DEFAULT_IMAGES,
//   showReferenceNav = true,
// }: ScrollRingExperienceProps) {
//   const rootRef = useRef<HTMLElement | null>(null);
//   const stageRef = useRef<HTMLDivElement | null>(null);

//   const safeImages = images.length > 0 ? images : DEFAULT_IMAGES;

//   useGSAP(
//     () => {
//       const root = rootRef.current;
//       const stage = stageRef.current;
//       if (!root || !stage) return;

//       const cards = gsap.utils.toArray<HTMLElement>(
//         "[data-orbit-card]",
//         stage,
//       );
//       const cardSetters = cards.map((card) => {
//         gsap.set(card, {
//           xPercent: -50,
//           yPercent: -50,
//           transformOrigin: "50% 50%",
//         });
//         return {
//           x: gsap.quickSetter(card, "x", "px"),
//           y: gsap.quickSetter(card, "y", "px"),
//           rotation: gsap.quickSetter(card, "rotation", "deg"),
//           scale: gsap.quickSetter(card, "scale"),
//         };
//       });
//       const intro = stage.querySelector<HTMLElement>("[data-intro]");
//       const foundation = stage.querySelector<HTMLElement>("[data-foundation]");
//       const metrics = gsap.utils.toArray<HTMLElement>(
//         "[data-metric]",
//         stage,
//       );

//       const prefersReducedMotion = window.matchMedia(
//         "(prefers-reduced-motion: reduce)",
//       ).matches;

//       const render = (rawTime: number) => {
//         const time = clamp(rawTime, 0, DURATION);
//         const width = window.innerWidth;
//         const height = window.innerHeight;
//         const mobile = width < 768;
//         const frame = sampleMotion(
//           time,
//           mobile ? MOBILE_MOTION : DESKTOP_MOTION,
//         );
//         const count = mobile
//           ? Math.min(MOBILE_CARD_COUNT, cards.length)
//           : cards.length;
//         const radiusBase = mobile ? height : width;
//         const orbitRadius = frame.radius * radiusBase;
//         const orbitCenterX = frame.cx * width;
//         const orbitCenterY = frame.cy * height;
//         const cardWidth = clamp(frame.card * radiusBase, mobile ? 92 : 150, mobile ? 150 : 286);
//         const spin = (frame.spin * Math.PI) / 180;

//         cards.forEach((card, index) => {
//           if (mobile && index >= count) {
//             card.style.opacity = "0";
//             return;
//           }

//           const angle = (index / count) * Math.PI * 2 + spin;
//           const x = orbitCenterX + Math.cos(angle) * orbitRadius;
//           const y = orbitCenterY + Math.sin(angle) * orbitRadius;
//           const tangentRotation = (angle * 180) / Math.PI - 90;
//           const subtleWobble = Math.sin(index * 1.73) * 1.25;
//           const depthScale = 0.96 + (Math.cos(angle) + 1) * 0.025;
//           const scale = depthScale * (mobile ? 0.94 : 1);
//           const cardHeight = cardWidth * 0.94;

//           card.style.width = `${cardWidth}px`;
//           card.style.height = `${cardHeight}px`;
//           card.style.opacity = "1";
//           card.style.zIndex = String(10 + Math.round((Math.sin(angle) + 1) * 5));
//           cardSetters[index].x(x);
//           cardSetters[index].y(y);
//           cardSetters[index].rotation(tangentRotation + subtleWobble);
//           cardSetters[index].scale(scale);
//         });

//         if (intro) {
//           const introIn = smoothstep(0.6, 2.6, time);
//           const introOut = smoothstep(10.2, 14.2, time);
//           intro.style.opacity = String(introIn * (1 - introOut));
//           intro.style.transform = `translate3d(0, ${18 - introIn * 18 - introOut * 55}px, 0)`;
//         }

//         if (foundation) {
//           const foundationIn = smoothstep(16.5, 20.5, time);
//           const foundationOut = smoothstep(26, 33, time);
//           const visibility = foundationIn * (1 - foundationOut);
//           foundation.style.opacity = String(visibility);
//           foundation.style.transform =
//             `translate3d(-50%, calc(-50% + ${14 * (1 - foundationIn) - 260 * foundationOut}px), 0)`;
//         }

//         const metricReveal = smoothstep(36.5, 41, time);
//         const metricHide = 1 - smoothstep(56.5, 59, time);
//         const activeMetric = clamp((time - 39) / 4.8, 0, METRICS.length - 1);

//         metrics.forEach((metric, index) => {
//           const offset = index - activeMetric;
//           const opacity = clamp(1 - Math.abs(offset) * 0.73, 0, 1);
//           const y = offset * (mobile ? 150 : 218);
//           metric.style.opacity = String(opacity * metricReveal * metricHide);
//           metric.style.transform =
//             `translate3d(0, calc(-50% + ${y}px), 0) scale(${1 - Math.min(Math.abs(offset), 1) * 0.035})`;
//         });
//       };

//       // The ?t= debug switch freezes the scene at a reference-video second.
//       // Example: /?t=24 shows the settled foundation ring.
//       const debugTime = new URLSearchParams(window.location.search).get("t");
//       if (debugTime !== null) {
//         const parsed = Number(debugTime);
//         render(Number.isFinite(parsed) ? parsed : 0);
//         return;
//       }

//       if (prefersReducedMotion) {
//         render(24);
//         return;
//       }

//       const playhead = { time: 0 };
//       const timeline = gsap.timeline({
//         defaults: { ease: "none" },
//         scrollTrigger: {
//           trigger: root,
//           start: "top top",
//           end: () => `+=${window.innerHeight * 6.15}`,
//           pin: stage,
//           pinSpacing: true,
//           scrub: 0.65,
//           anticipatePin: 1,
//           invalidateOnRefresh: true,
//           onRefresh: (self) => {
//             playhead.time = self.progress * DURATION;
//             render(playhead.time);
//           },
//         },
//       });

//       timeline.to(playhead, {
//         time: DURATION,
//         duration: 1,
//         ease: "none",
//         onUpdate: () => render(playhead.time),
//       });

//       render(0);
//       requestAnimationFrame(() => ScrollTrigger.refresh());

//     },
//     { scope: rootRef, dependencies: [safeImages.length], revertOnUpdate: true },
//   );

//   return (
//     <section ref={rootRef} className="orbit-root" aria-label="Image orbit story">
//       <div ref={stageRef} className="orbit-stage">
//         {showReferenceNav && (
//           <nav className="reference-nav" aria-label="Main navigation">
//             <div className="reference-brand">
//               <span className="brand-mark">T</span>
//               <span className="brand-name">
//                 TRIPADA
//                 <small>HEALTHCARE PVT. LTD.</small>
//               </span>
//             </div>
//             <div className="reference-links">
//               <span>PRODUCTS</span>
//               <span className="contact-pill">CONTACT</span>
//             </div>
//           </nav>
//         )}

//         <div className="orbit-field" aria-hidden="true">
//           {safeImages.slice(0, DESKTOP_CARD_COUNT).map((image, index) => (
//             <div className="orbit-card" data-orbit-card key={`${index}-${image}`}>
//               {/* Native img keeps the moving cards lightweight; use local WebP files in production. */}
//               <img
//                 src={makeImageUrl(image)}
//                 alt=""
//                 draggable={false}
//                 loading="eager"
//                 decoding="async"
//               />
//             </div>
//           ))}
//         </div>

//         <div className="intro-copy" data-intro>
//           <p className="eyebrow">People &amp;<br />Process</p>
//           <h1>
//             A studio shaped by<br />
//             clarity, trust, and a<br />
//             collective pursuit of<br />
//             thoughtful design.
//           </h1>
//         </div>

//         <div className="foundation-copy" data-foundation>
//           <h2>2011 Year<br />of<br />Foundation</h2>
//           <div className="foundation-notes">
//             <p>
//               Design approach grounded in passive strategies,<br />
//               material logic, and environmental responsibility.
//             </p>
//             <p>
//               Lifecycle-focused architecture with efficient systems,<br />
//               sustainable choices, and long-term value.
//             </p>
//           </div>
//         </div>

//         <div className="metrics-stage" aria-label="Company facts">
//           {METRICS.map((metric) => (
//             <div className="metric" data-metric key={metric.number}>
//               <div className="metric-number">{metric.number}</div>
//               <div className="metric-label">{metric.label}</div>
//             </div>
//           ))}
//         </div>
//         <div className="scene-grain" aria-hidden="true" />
//       </div>
//     </section>
//   );
// }
