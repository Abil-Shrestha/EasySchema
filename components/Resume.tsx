import EditableDiv from "@/components/Resume/EditableDiv";
import ProjectItem from "@/components/Resume/ProjectItem";
import WorkExperienceItem from "@/components/Resume/WorkExperienceItem";
import ResumePDF from "@/components/ResumePDF";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {ResumeSchema, tailoredResumeSchema} from "@/lib/schema";
import {useResumeStore} from "@/store/resumeStore";
import {
  Education,
  PersonalInfo,
  Project,
  useUpdatedResumeStore,
  WorkExperience,
} from "@/store/updatedResumeStore";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {experimental_useObject} from "ai/react";
import {Loader2, Plus} from "lucide-react";
import React, {useEffect, useState} from "react";

export default function ResumeBuildingApp() {
  const originalResume = useResumeStore();
  const updatedResumeStore = useUpdatedResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [showTailoredResume, setShowTailoredResume] = useState(false);
  const [resumeToDisplay, setResumeToDisplay] =
    useState<ResumeSchema>(originalResume);

  useEffect(() => {
    setResumeToDisplay(
      showTailoredResume ? updatedResumeStore : originalResume
    );
  }, [showTailoredResume, updatedResumeStore, originalResume]);

  const {submit, isLoading, object, error} = experimental_useObject<{
    resume: ResumeSchema;
  }>({
    api: "/api/tailor-resume",
    schema: tailoredResumeSchema,
    onFinish({object}) {
      console.log("Object:", object);
      if (object && object.resume) {
        updateResumeWithTailoredData(object.resume);
        setJobDescription("");
        setShowTailoredResume(true);
      } else {
        console.error("Object or object.resume is null or undefined");
      }
    },
    onError: (error) => {
      console.error("Error in useObject:", error);
    },
  });

  const updateResumeWithTailoredData = (tailoredResume: ResumeSchema) => {
    // Update personal info
    Object.entries(tailoredResume.personalInfo).forEach(([key, value]) => {
      if (value) {
        updatedResumeStore.updatePersonalInfo(key as keyof PersonalInfo, value as string);
      }
    });
  
    // Update education
    Object.entries(tailoredResume.education).forEach(([key, value]) => {
      if (value) {
        updatedResumeStore.updateEducation(key as keyof Education, value as string);
      }
    });
  
    // Update skills
    if (tailoredResume.skills) {
      updatedResumeStore.updateSkills(tailoredResume.skills);
    }
  
    // Update work experiences
    updatedResumeStore.updateWorkExperiences(tailoredResume.workExperiences);
  
    // Update projects
    updatedResumeStore.updateProjects(tailoredResume.projects);
  };

  const {personalInfo, workExperiences, education, skills, projects} =
    resumeToDisplay;

  const updatePersonalInfo = (key: keyof PersonalInfo, value: string) => {
    if (showTailoredResume) {
      updatedResumeStore.updatePersonalInfo(key, value);
    } else {
      originalResume.updatePersonalInfo(key, value);
    }
  };

  const updateEducation = (key: keyof Education, value: string) => {
    if (showTailoredResume) {
      updatedResumeStore.updateEducation(key, value);
    } else {
      originalResume.updateEducation(key, value);
    }
  };

  const updateWorkExperience = (updatedExperience: WorkExperience) => {
    if (showTailoredResume) {
      updatedResumeStore.updateWorkExperience(updatedExperience);
    } else {
      originalResume.updateWorkExperience(updatedExperience);
    }
  };

  const removeWorkExperience = (id: number) => {
    if (showTailoredResume) {
      updatedResumeStore.removeWorkExperience(id);
    } else {
      originalResume.removeWorkExperience(id);
    }
  };

  const addWorkExperience = () => {
    if (showTailoredResume) {
      updatedResumeStore.addWorkExperience();
    } else {
      originalResume.addWorkExperience();
    }
  };

  const updateSkills = (value: string) => {
    if (showTailoredResume) {
      updatedResumeStore.updateSkills(value);
    } else {
      originalResume.updateSkills(value);
    }
  };

  const updateProject = (updatedProject: Project) => {
    if (showTailoredResume) {
      updatedResumeStore.updateProject(updatedProject);
    } else {
      originalResume.updateProject(updatedProject);
    }
  };

  const removeProject = (id: number) => {
    if (showTailoredResume) {
      updatedResumeStore.removeProject(id);
    } else {
      originalResume.removeProject(id);
    }
  };

  const addProject = () => {
    if (showTailoredResume) {
      updatedResumeStore.addProject();
    } else {
      originalResume.addProject();
    }
  };

  const handleTailorResume = async (event: React.FormEvent) => {
    event.preventDefault();
    if (jobDescription.trim()) {
      submit({currentResume: originalResume, jobDescription});
    }
  };

  const GeneratePDFButton = () => (
    <PDFDownloadLink
      document={
        <ResumePDF
          personalInfo={personalInfo}
          workExperiences={workExperiences}
          education={education}
          skills={skills}
          projects={projects}
        />
      }
      fileName="resume.pdf"
    >
      {({loading}) => (loading ? "Generating PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );

  return (
    <div id="resume-content" className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Label htmlFor="resume-switch">Show Tailored Resume</Label>
        <Switch
          id="resume-switch"
          checked={showTailoredResume}
          onCheckedChange={setShowTailoredResume}
          disabled={!updatedResumeStore.personalInfo.name}
        />
      </div>
      <div className="bg-white p-8 border-dashed border relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-center">
            Tailoring in progress...
          </div>
        )}
        {/* Personal Info */}
        <div className="text-center mb-6">
          <EditableDiv
            value={personalInfo.name}
            onChange={(value) => updatePersonalInfo("name", value)}
            placeholder="Your Name"
            className="text-4xl font-bold mb-2"
          />
          <div className="flex justify-center items-center space-x-2">
            <EditableDiv
              value={personalInfo.location}
              onChange={(value) => updatePersonalInfo("location", value)}
              placeholder="Location"
              className="inline-block"
            />
            <span className="text-gray-500">|</span>
            <EditableDiv
              value={personalInfo.email}
              onChange={(value) => updatePersonalInfo("email", value)}
              placeholder="Email"
              className="inline-block"
            />
            <span className="text-gray-500">|</span>
            <EditableDiv
              value={personalInfo.portfolio}
              onChange={(value) => updatePersonalInfo("portfolio", value)}
              placeholder="Portfolio URL"
              className="inline-block"
            />
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-2">Education</h2>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <EditableDiv
                value={education.university}
                onChange={(value) => updateEducation("university", value)}
                placeholder="University Name"
                className="font-bold"
              />
              <EditableDiv
                value={education.degree}
                onChange={(value) => updateEducation("degree", value)}
                placeholder="Degree, Major, GPA"
              />
            </div>
            <div className="text-right">
              <EditableDiv
                value={education.graduationDate}
                onChange={(value) => updateEducation("graduationDate", value)}
                placeholder="Graduation Date"
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-2">Work Experience</h2>
          {workExperiences.map((experience) => (
            <WorkExperienceItem
              key={experience.id}
              experience={experience}
              updateExperience={updateWorkExperience}
              removeExperience={removeWorkExperience}
            />
          ))}
          {!isLoading && (
            <Button
              onClick={addWorkExperience}
              variant="outline"
              size="sm"
              className="print:hidden"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Work Experience
            </Button>
          )}
        </div>

        {/* Projects */}
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-2">Projects</h2>
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              updateProject={updateProject}
              removeProject={removeProject}
            />
          ))}
          {!isLoading && (
            <Button
              onClick={addProject}
              variant="outline"
              size="sm"
              className="print:hidden"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-2">Skills</h2>
          <EditableDiv
            value={skills}
            onChange={updateSkills}
            placeholder="List your skills here"
            className="whitespace-pre-wrap"
          />
        </div>
      </div>
      {!isLoading && (
        <div className="flex justify-center mt-6 mb-6 print:hidden">
          <Button>
            <GeneratePDFButton />
          </Button>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Tailor Your Resume</h2>
        <form onSubmit={handleTailorResume} className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            className="w-full p-2 border rounded"
          />
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
        </form>
      </div>
    </div>
  );
}
