"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResumeSchema } from "@/lib/schema";
import {
  type Education,
  type PersonalInfo,
  useResumeStore,
} from "@/store/resumeStore";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import * as pdfjsLib from "pdfjs-dist";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function ResumeProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const setupPdfWorker = async () => {
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.mjs"
    };
    setupPdfWorker();
  }, []);

  const updateResumeWithProcessedData = (resumeData: any) => {
    // Update personal info
    if (resumeData.personalInfo) {
      Object.entries(resumeData.personalInfo).forEach(([key, value]) => {
        if (value) {
          updatePersonalInfo(key as keyof PersonalInfo, value as string);
        }
      });
    }

    // Update work experiences
    if (resumeData.workExperiences) {
      updateWorkExperiences(resumeData.workExperiences);
    }

    // Update education
    if (resumeData.education) {
      Object.entries(resumeData.education).forEach(([key, value]) => {
        if (value) {
          updateEducation(key as keyof Education, value as string);
        }
      });
    }

    // Update skills
    if (resumeData.skills) {
      updateSkills(resumeData.skills);
    }

    // Update projects
    if (resumeData.projects) {
      updateProjects(resumeData.projects);
    }
    posthog.capture("resume_processed");
    setResumeProcessed(true);
  };

  const { submit, isLoading, object, error } = useObject<{
    resume: any;
  }>({
    api: "/api/process-resume",
    schema: ResumeSchema,
    onFinish({ object }) {
      console.log("Processed resume:", object);
      if (object && object.resume) {
        updateResumeWithProcessedData(object.resume);
        toast.success("Resume processed successfully!");
      } else {
        console.error("Object or object.resume is null or undefined");
        toast.error("Error processing resume. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Error in processing resume:", error);
      toast.error("Error processing resume: " + (error.message || "Please try again"));
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
      toast.error("Please select a PDF file to upload");
      return;
    }

    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      await submit({ resumeText: text });
    } catch (err) {
      console.error("Error processing PDF:", err);
      toast.error("Error processing PDF. Please try again with a different file.");
    }
  };

  // Function to format JSON for display
  const formatJSON = (json: any) => {
    if (!json) return null;

    return (
      <div className="space-y-4">
        {json.personalInfo && (
          <div>
            <h4 className="font-medium text-primary">Personal Information</h4>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.entries(json.personalInfo).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium">{key}: </span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {json.education && (
          <div>
            <h4 className="font-medium text-primary">Education</h4>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.entries(json.education).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium">{key}: </span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {json.skills && (
          <div>
            <h4 className="font-medium text-primary">Skills</h4>
            <p className="text-sm mt-1">{json.skills}</p>
          </div>
        )}

        {json.workExperiences && json.workExperiences.length > 0 && (
          <div>
            <h4 className="font-medium text-primary">Work Experience</h4>
            <div className="space-y-2 mt-1">
              {json.workExperiences.map((exp: any, index: number) => (
                <div key={index} className="text-sm border-l-2 border-primary/30 pl-2">
                  <div><span className="font-medium">Company: </span>{exp.company}</div>
                  <div><span className="font-medium">Title: </span>{exp.title}</div>
                  <div><span className="font-medium">Date: </span>{exp.date}</div>
                  {exp.description && exp.description.length > 0 && (
                    <div>
                      <span className="font-medium">Description: </span>
                      <ul className="list-disc list-inside ml-2">
                        {exp.description.map((desc: string, i: number) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {json.projects && json.projects.length > 0 && (
          <div>
            <h4 className="font-medium text-primary">Projects</h4>
            <div className="space-y-2 mt-1">
              {json.projects.map((project: any, index: number) => (
                <div key={index} className="text-sm border-l-2 border-primary/30 pl-2">
                  <div><span className="font-medium">Name: </span>{project.name}</div>
                  <div><span className="font-medium">Description: </span>{project.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume PDF to get started. We'll analyze it and help you optimize it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
            ? "border-primary bg-primary/5"
            : file
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            {file ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-green-600">File Selected</p>
                  <p className="text-sm text-gray-500">{file.name}</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Drag & Drop your resume here</p>
                  <p className="text-sm text-gray-500">or click to browse files</p>
                </div>
                <p className="text-xs text-gray-400">Supports PDF files only</p>
              </>
            )}
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-center">
            <Button
              onClick={processFile}
              disabled={isLoading}
              className="w-full max-w-xs"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Process Resume
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error processing resume</h3>
                <p className="text-sm text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center p-4 border rounded-md bg-blue-50">
            <p className="text-sm text-blue-700">
              Analyzing your resume... This may take a moment.
            </p>
          </div>
        )}

        {object && object.resume && (
          <div className="border rounded-md p-4 bg-green-50">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-green-700">Resume Analyzed</h3>
            </div>
            <div className="bg-white rounded-md p-4 overflow-auto max-h-96">
              {formatJSON(object.resume)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
