import ScrollRingGallery from "@/components/ScrollRingGallery";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-4xl font-bold text-blue-600">
            HB Softweb Blog CMS
          </h1>

          <p className="mt-4 text-gray-600">
            Next.js and Tailwind CSS are working!
          </p>

          <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Test Button
          </button>
        </div>
      </main>
      <ScrollRingGallery />
    </>
  );
}
