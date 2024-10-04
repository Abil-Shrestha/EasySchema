import React, { useMemo } from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "@/components/ResumePDF";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resumeStore";
import { useUpdatedResumeStore } from "@/store/updatedResumeStore";

interface PDFDownloadButtonProps {
  showTailoredResume: boolean;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ showTailoredResume }) => {
  const originalResume = useResumeStore();
  const updatedResume = useUpdatedResumeStore();

  const resumeToUse = showTailoredResume ? updatedResume : originalResume;

  const { personalInfo, workExperiences, education, skills, projects } = resumeToUse;

  const resumeDocument = useMemo(() => (
    <ResumePDF
      personalInfo={personalInfo}
      workExperiences={workExperiences}
      education={education}
      skills={skills}
      projects={projects}
    />
  ), [personalInfo, workExperiences, education, skills, projects]);

  return (
    <PDFDownloadLink
      document={resumeDocument}
      fileName="resume.pdf"
    >
      {({ loading }) => (
        <Button disabled={loading}>
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;