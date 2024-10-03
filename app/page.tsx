"use client";

import { useResumeStore } from "@/store/resumeStore";
import dynamic from "next/dynamic";

const ResumeBuildingApp = dynamic(() => import("@/components/Resume"), {
  ssr: false,
});

const ResumeProcessor = dynamic(() => import("@/components/resume-processor"), {
  ssr: false,
});

export default function Home() {
  const isResumeProcessed = useResumeStore((state) => state.isResumeProcessed);

  return (
    <main className="flex min-h-screen">
      {!isResumeProcessed && <ResumeProcessor />}
      <ResumeBuildingApp />
    </main>
  );
}