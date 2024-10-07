"use client";

import {useResumeStore} from "@/store/resumeStore";
import dynamic from "next/dynamic";
import {usePostHog} from "posthog-js/react";

const ResumeBuildingApp = dynamic(() => import("@/components/Resume"), {
  ssr: false,
});

const ResumeProcessor = dynamic(() => import("@/components/resume-processor"), {
  ssr: false,
});

export default function Home() {
  const posthog = usePostHog();
  const isResumeProcessed = useResumeStore((state) => state.isResumeProcessed);

  posthog.capture("Started APP", {property: "100"});

  return (
    <main className="flex min-h-screen">
      {!isResumeProcessed && <ResumeProcessor />}
      <ResumeBuildingApp />
    </main>
  );
}
