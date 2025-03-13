"use client";

import ErrorBoundary from "@/components/error-boundary";
import WelcomeModal from "@/components/welcome-modal";
import { useResumeStore } from "@/store/resumeStore";
import dynamic from "next/dynamic";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const ResumeBuildingApp = dynamic(() => import("@/components/Resume"), {
  ssr: false,
});

const ResumeProcessor = dynamic(() => import("@/components/resume-processor"), {
  ssr: false,
});
import DashedBorder from "@/components/decorative-border";

export default function Home() {
  const posthog = usePostHog();
  const isResumeProcessed = useResumeStore((state) => state.isResumeProcessed);

  useEffect(() => {
    try {
      posthog?.capture("App Started", { property: "100" });
    } catch (error) {
      console.error("Failed to capture analytics:", error);
    }
  }, [posthog]);

  return (
    <ErrorBoundary>
      <WelcomeModal />
      <main className="flex min-h-screen items-center justify-center">
        {!isResumeProcessed ? (
          <ResumeProcessor />
        ) : (
          <ResumeBuildingApp />
        )}
      </main>
    </ErrorBoundary>
  );
}
