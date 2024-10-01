"use client";

import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useResumeStore} from "@/store/resumeStore";
import {useState} from "react";

export default function ResumeTailor() {
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentResume = useResumeStore(state => ({
    personalInfo: state.personalInfo,
    workExperiences: state.workExperiences,
    education: state.education,
    skills: state.skills,
    projects: state.projects,
  }));
  const updateResume = useResumeStore((state) => ({
    updatePersonalInfo: state.updatePersonalInfo,
    updateWorkExperience: state.updateWorkExperience,
    updateEducation: state.updateEducation,
    updateSkills: state.updateSkills,
    updateProject: state.updateProject,
  }));

  const handleTailorResume = async () => {
    setIsLoading(true);
    console.log("Current Resume:", currentResume);
    try {
      const response = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({currentResume, jobDescription}),
      });

      if (!response.ok) {
        throw new Error("Failed to tailor resume");
      }

      const tailoredResume = await response.json();

      // Update the resume store with the tailored resume
      Object.entries(tailoredResume.personalInfo).forEach(([key, value]) => {
        updateResume.updatePersonalInfo(
          key as keyof typeof tailoredResume.personalInfo,
          value as string
        );
      });

      tailoredResume.workExperiences.forEach((exp) => {
        updateResume.updateWorkExperience(exp);
      });

      Object.entries(tailoredResume.education).forEach(([key, value]) => {
        updateResume.updateEducation(
          key as keyof typeof tailoredResume.education,
          value as string
        );
      });

      updateResume.updateSkills(tailoredResume.skills);

      tailoredResume.projects.forEach((project) => {
        updateResume.updateProject(project);
      });

      alert("Resume tailored successfully!");
    } catch (error) {
      console.error("Error tailoring resume:", error);
      alert("Failed to tailor resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={10}
      />
      <Button onClick={handleTailorResume} disabled={isLoading}>
        {isLoading ? "Tailoring..." : "Tailor Resume"}
      </Button>
    </div>
  );
}
