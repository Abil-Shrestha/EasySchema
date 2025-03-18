"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResumeSchema } from "@/lib/schema";
import {
  type Education,
  type PersonalInfo,
  useResumeStore,
} from "@/store/resumeStore";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AlertCircle, CheckCircle, FileText, Loader, Upload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { usePostHog } from "posthog-js/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

// Define DeepPartial type for handling partial resume data
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

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
      "use client";
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
    };
    setupPdfWorker();
  }, []);

  const updateResumeWithProcessedData = (resumeData: DeepPartial<z.infer<typeof ResumeSchema>>) => {
    // Make sure we're working with the correct structure
    const data = resumeData.resume || resumeData as any;
    
    // Update personal info
    if (data?.personalInfo) {
      for (const [key, value] of Object.entries(data.personalInfo)) {
        if (value) {
          updatePersonalInfo(key as keyof PersonalInfo, value as string);
        }
      }
    }

    // Update work experiences
    if (data?.workExperiences) {
      const formattedWorkExperiences = data.workExperiences.map((exp: {
        location?: string;
        company?: string;
        title?: string;
        date?: string;
        description?: string[];
      }) => ({
        location: exp.location || "",
        company: exp.company || "",
        title: exp.title || "",
        date: exp.date || "",
        description: exp.description || []
      }));
      updateWorkExperiences(formattedWorkExperiences);
    }

    // Update education
    if (data?.education) {
      Object.entries(data.education).forEach(([key, value]) => {
        if (value) {
          updateEducation(key as keyof Education, value as string);
        }
      });
    }

    // Update skills
    if (data?.skills) {
      updateSkills(data.skills);
    }

    // Update projects
    if (data?.projects) {
      const formattedProjects = data.projects.map((project: {
        name?: string;
        link?: string;
        description?: string[];
        technologies?: string;
      }) => ({
        name: project.name || "",
        link: project.link || "",
        description: project.description || [],
        technologies: project.technologies || ""
      }));
      updateProjects(formattedProjects);
    }
    posthog.capture("resume_processed");
    setResumeProcessed(true);
  };

  // Add detailed logging for debugging streaming issues
  const logDebug = (message: string, data?: unknown) => {
    console.log(`[CLIENT] ${message}`, data);
  };

  const {submit, isLoading, object, error} = useObject({
    api: "/api/process-resume",
    schema: ResumeSchema,

    onFinish({object}) {
      logDebug("Resume processing finished", { objectReceived: !!object, objectType: typeof object });
      if (object) {
        logDebug("Object structure", { 
          hasResume: !!object.resume,
          resumeType: object.resume ? typeof object.resume : 'undefined',
          keys: Object.keys(object)
        });
        try {
          logDebug("Updating resume with processed data");
          updateResumeWithProcessedData(object);
          toast.success("Resume processed successfully!");
          logDebug("Resume updated successfully");
        } catch (updateError) {
          logDebug("Error updating resume", { error: updateError });
          console.error("[CLIENT] Error updating resume:", updateError);
          toast.error("Error updating resume data. Please try again.");
        }
      } else {
        logDebug("Received null or undefined object");
        console.error("[CLIENT] Object is null or undefined");
        toast.error("Error processing resume. Please try again.");
      }
    },
    onError: (error) => {
      logDebug("Error in resume processing", { 
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : String(error)
      });
      console.error("[CLIENT] Error processing resume:", error);
      
      // Provide more specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
          toast.error("Network error. Please check your connection and try again.");
        } else if (error.message.includes('timeout')) {
          toast.error("Request timed out. The server might be busy, please try again later.");
        } else if (error.message.includes('parse') || error.message.includes('JSON')) {
          toast.error("Error parsing response. There might be an issue with the server response format.");
        } else if (error.message.includes('stream') || error.message.includes('chunk')) {
          toast.error("Error with response streaming. This might be an issue with Vercel's serverless functions.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  const extractTextFromPdf = (file: File): Promise<string> => {
    logDebug("Starting PDF text extraction", { fileName: file.name, fileSize: file.size });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        logDebug("FileReader loaded file", { resultSize: event.target?.result ? (event.target.result as ArrayBuffer).byteLength : 0 });
        try {
          const typedarray = new Uint8Array(
            event.target?.result as ArrayBuffer
          );
          logDebug("Converting PDF to document");
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          logDebug("PDF loaded", { numPages: pdf.numPages });
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            logDebug(`Processing page ${i} of ${pdf.numPages}`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => {
                // Handle both TextItem and TextMarkedContent types
                return 'str' in item ? item.str : '';
              })
              .join(" ");
            fullText = `${fullText}${pageText}\n\n`;
          }

          logDebug("PDF text extraction complete", { textLength: fullText.length });
          resolve(fullText);
        } catch (error) {
          logDebug("Error in PDF extraction", { error });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logDebug("FileReader error", { error });
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async () => {
    logDebug("Process file function called");
    if (!file) {
      logDebug("No file selected");
      toast.error("Please select a PDF file to upload");
      return;
    }

    try {
      logDebug("Starting PDF processing", { fileName: file.name, fileSize: file.size });
      const text = await extractTextFromPdf(file);

      if (!text || text.trim().length === 0) {
        logDebug("Empty text extracted from PDF");
        toast.error("Could not extract text from the PDF. Please try a different file.");
        return;
      }

      logDebug("PDF text extracted successfully", { textLength: text.length });
      setPdfText(text);

      // Add environment information to help debug Vercel issues
      logDebug("Environment information", { 
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production',
        userAgent: window.navigator.userAgent,
        hostname: window.location.hostname
      });

      logDebug("Submitting text for AI processing");
      const startTime = Date.now();
      try {
        await submit({ resumeText: text });
        logDebug("Submit completed", { timeElapsed: Date.now() - startTime });
      } catch (submitError) {
        logDebug("Error in submit function", { 
          error: submitError,
          timeElapsed: Date.now() - startTime 
        });
        throw submitError; // Re-throw to be caught by outer catch
      }
    } catch (err) {
      logDebug("Error in processFile function", { error: err });
      console.error("[CLIENT] Error processing PDF:", err);
      if (err instanceof Error) {
        if (err.message.includes("corrupt")) {
          toast.error("The PDF file appears to be corrupted. Please try a different file.");
        } else if (err.message.includes("password")) {
          toast.error("This PDF is password protected. Please remove the password and try again.");
        } else if (err.message.includes("network") || err.message.includes("fetch")) {
          toast.error("Network error while processing. Please check your connection and try again.");
        } else if (err.message.includes("timeout")) {
          toast.error("Request timed out. The server might be busy, please try again later.");
        } else if (err.message.includes("stream") || err.message.includes("chunk")) {
          toast.error("Error with response streaming. This might be an issue with Vercel's serverless functions.");
        } else {
          toast.error(`Error processing PDF: ${err.message}`);
        }
      } else {
        toast.error("Error processing PDF. Please try again with a different file.");
      }
    }
  };

  // Function to format JSON for display
  const formatJSON = (json: {
    personalInfo?: Record<string, string>;
    education?: Record<string, string>;
    workExperiences?: Array<{
      company?: string;
      title?: string;
      date?: string;
      location?: string;
      description?: string[];
    }>;
    skills?: string;
    projects?: Array<{
      name?: string;
      link?: string;
      description?: string[];
      technologies?: string;
    }>;
  }) => {
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
              {json.workExperiences.map((exp, index) => (
                <div key={`work-${exp.company}-${index}`} className="text-sm border-l-2 border-primary/30 pl-2">
                  <div><span className="font-medium">Company: </span>{exp.company}</div>
                  <div><span className="font-medium">Title: </span>{exp.title}</div>
                  <div><span className="font-medium">Date: </span>{exp.date}</div>
                  {exp.description && exp.description.length > 0 && (
                    <div>
                      <span className="font-medium">Description: </span>
                      <ul className="list-disc list-inside ml-2">
                        {exp.description.map((desc, i) => (
                          <li key={`work-desc-${index}-${i}`}>{desc}</li>
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
              {json.projects.map((project, index) => (
                <div key={`project-${project.name}-${index}`} className="text-sm border-l-2 border-primary/30 pl-2">
                  <div><span className="font-medium">Name: </span>{project.name}</div>
                  <div><span className="font-medium">Description: </span>
                    {Array.isArray(project.description) 
                      ? project.description.join(', ') 
                      : String(project.description)}
                  </div>
                  {project.technologies && (
                    <div><span className="font-medium">Technologies: </span>{project.technologies}</div>
                  )}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleUploadClick();
            }
          }}
          role="button"
          tabIndex={0}
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
                <p className="text-sm text-red-700 mt-1">
                  {error.message}
                </p>
                {error.message && (error.message.includes("stream") || error.message.includes("timeout")) && (
                  <p className="text-xs text-red-600 mt-1">
                    This may be due to a server timeout. Try uploading a smaller PDF or contact support if the issue persists.
                  </p>
                )}
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
