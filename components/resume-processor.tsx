"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {ResumeSchema} from "@/lib/schema";
import {Education, PersonalInfo, useResumeStore} from "@/store/resumeStore";
import {experimental_useObject as useObject} from "ai/react";
import * as pdfjsLib from "pdfjs-dist";
import {usePostHog} from "posthog-js/react";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export default function ResumeProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const posthog = usePostHog();
  const {
    updatePersonalInfo,
    updateWorkExperiences,
    updateEducation,
    updateSkills,
    updateProjects,
    setResumeProcessed,
  } = useResumeStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const setupPdfWorker = async () => {
      "use client";
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
    };
    setupPdfWorker();
  }, []);

  const updateResumeWithProcessedData = (resume: ResumeSchema) => {
    // Update personal info
    if (resume.personalInfo) {
      Object.entries(resume.personalInfo).forEach(([key, value]) => {
        if (value) {
          updatePersonalInfo(key as keyof PersonalInfo, value as string);
        }
      });
    }

    // Update work experiences
    if (resume.workExperiences) {
      updateWorkExperiences(resume.workExperiences);
    }

    // Update education
    if (resume.education) {
      Object.entries(resume.education).forEach(([key, value]) => {
        if (value) {
          updateEducation(key as keyof Education, value as string);
        }
      });
    }

    // Update skills
    if (resume.skills) {
      updateSkills(resume.skills);
    }

    // Update projects
    if (resume.projects) {
      updateProjects(resume.projects);
    }
    posthog.capture("resume_processed");
    setResumeProcessed(true);
  };

  const {submit, isLoading, object, error} = useObject<{
    resume: ResumeSchema;
  }>({
    api: "/api/process-resume",
    schema: ResumeSchema,
    onFinish({object}) {
      console.log("Processed resume:", object);
      if (object && object.resume) {
        updateResumeWithProcessedData(object.resume);
        toast("Resume processed successfully!");
      } else {
        console.error("Object or object.resume is null or undefined");
      }
    },
    onError: (error) => {
      console.error("Error in processing resume:", error);
    },
  });

  const extractTextFromPdf = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(
            event.target?.result as ArrayBuffer
          );
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += pageText + "\n\n";
          }

          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async () => {
    if (!file) {
      console.error("Please select a file to upload");
      return;
    }

    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      await submit({resumeText: text});
    } catch (err) {
      console.error("Error processing PDF:", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Resume Processor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input type="file" onChange={handleFileChange} accept=".pdf" />
          <Button
            onClick={processFile}
            disabled={isLoading || !file}
            className="mt-2"
          >
            {isLoading ? "Processing..." : "Process Resume"}
          </Button>
        </div>
        {error && <p className="text-red-500">{error.message}</p>}
        {pdfText && (
          <div>
            <h3 className="text-lg font-semibold">Extracted PDF Text</h3>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-40">
              {pdfText}
            </pre>
          </div>
        )}
        {object && object.resume && (
          <div>
            <h3 className="text-lg font-semibold">Processed Resume</h3>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(object.resume, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
