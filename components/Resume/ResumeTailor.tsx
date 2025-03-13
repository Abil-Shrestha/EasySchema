"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { tailoredResumeSchema } from "@/lib/schema";
import { useResumeStore } from "@/store/resumeStore";
import { useUpdatedResumeStore } from "@/store/updatedResumeStore";
import { experimental_useObject } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ResumeTailor() {
  const [jobDescription, setJobDescription] = useState("");
  const jobDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const currentResume = useResumeStore((state) => ({
    personalInfo: state.personalInfo,
    workExperiences: state.workExperiences,
    education: state.education,
    skills: state.skills,
    projects: state.projects,
  }));

  const {setUpdatedResume, clearUpdatedResume} = useUpdatedResumeStore();

  const {submit, isLoading, object} = experimental_useObject({
    api: "/api/tailor-resume",
    schema: tailoredResumeSchema,
    onFinish({object}) {
      if (object) {
        setUpdatedResume(object.resume);
        setJobDescription("");
        jobDescriptionRef.current?.focus();
        toast.success("Resume tailored successfully!");
      } else {
        console.error("Object is null or undefined");
        toast.error("Failed to tailor resume. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Error in useObject:", error);
      toast.error(
        "An error occurred while tailoring the resume. Please try again."
      );
    },
  });

  const handleTailorResume = async (event: React.FormEvent) => {
    event.preventDefault();
    if (jobDescription.trim()) {
      submit({currentResume, jobDescription});
    }
  };

  const handleClearTailoredResume = () => {
    clearUpdatedResume();
    setJobDescription("");
  };

  return (
    <div className="space-y-4 h-dvh mr-12">
      <form onSubmit={handleTailorResume} className="space-y-4">
        <Textarea
          className="h-1/2"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
          ref={jobDescriptionRef}
          disabled={isLoading}
        />
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading || !jobDescription.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tailoring...
              </>
            ) : (
              "Tailor Resume"
            )}
          </Button>
          <Button
            onClick={handleClearTailoredResume}
            variant="outline"
            disabled={isLoading}
          >
            Clear Tailored Resume
          </Button>
        </div>
      </form>

      {isLoading && object?.resume && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">Tailoring Progress:</h3>
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(object.resume, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
