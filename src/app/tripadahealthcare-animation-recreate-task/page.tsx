// import ScrollRingGallery from "@/components/ScrollRingGallery";
// // import { ScrollRingExperience } from "../../components/ScrollRingExperience";
// export default function Page() {
//   return (
//     <>
//       <ScrollRingGallery />
//       {/* <ScrollRingExperience /> */}
//     </>
//   );
// }

import ScrollRingGallery from "@/components/ScrollRingGallery";
import TripadaNavbar from "@/components/TripadaNavbar";

// app/page.tsx

export default function Page() {
  return (
    <main className="bg-black">
      <TripadaNavbar />
      <ScrollRingGallery />
    </main>
  );
}
