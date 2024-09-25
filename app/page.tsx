"use client";

import dynamic from "next/dynamic";
const ResumeBuildingApp = dynamic(() => import("@/components/Resume"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <ResumeBuildingApp />
    </main>
  );
}
