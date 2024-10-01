"use client";

import dynamic from "next/dynamic";
const ResumeBuildingApp = dynamic(() => import("@/components/Resume"), {
  ssr: false,
});

const ResumeTailor = dynamic(() => import("@/components/Resume/ResumeTailor"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <ResumeBuildingApp />
      <ResumeTailor />
    </main>
  );
}
