//@ts-nocheck
import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Download, Plus, Trash2} from "lucide-react";
import ResumePDF from "@/components/ResumePDF";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {useResumeStore} from "@/store/resumeStore";
import EditableDiv from "@/components/Resume/EditableDiv";
import BulletedList from "@/components/Resume/BulletedList";
import WorkExperienceItem from "@/components/Resume/WorkExperienceItem";
import GridSystem from "@/components/Resume/DottedGridWrapper";
import CornerStar from "@/components/Resume/CornerStar";

const ProjectItem = ({project, updateProject, removeProject}) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <EditableDiv
        value={project.name}
        onChange={(value) => updateProject({...project, name: value})}
        placeholder="Project Name"
        className="font-bold"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeProject(project.id)}
        className="text-red-500 hover:text-red-700 print:hidden"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
    <EditableDiv
      value={project.description}
      onChange={(value) => updateProject({...project, description: value})}
      placeholder="Project description"
      className="mt-1"
    />
    <EditableDiv
      value={project.technologies}
      onChange={(value) => updateProject({...project, technologies: value})}
      placeholder="Technologies used"
      className="mt-1 text-sm italic"
    />
  </div>
);

export default function ResumeBuildingApp() {
  const {
    personalInfo,
    workExperiences,
    education,
    skills,
    projects,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    updateEducation,
    updateSkills,
    addProject,
    updateProject,
    removeProject,
  } = useResumeStore();

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
      Download PDF
    </PDFDownloadLink>
  );

  return (
    <div id="resume-content" className="container mx-auto p-4 max-w-4xl ">
      <div className="bg-white p-8 border-dashed border relative">
        {/*personal info */}
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

        {/*Education*/}
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
          <div className="mt-2"></div>
        </div>

        {/*Work Experience*/}
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
          <Button
            onClick={addWorkExperience}
            variant="outline"
            size="sm"
            className="print:hidden"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Work Experience
          </Button>
        </div>

        {/*Projects*/}
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
          <Button
            onClick={addProject}
            variant="outline"
            size="sm"
            className="print:hidden"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>

        {/*Skills*/}
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
      <div className="flex justify-center mt-6 mb-6 print:hidden">
        <Button>
          <GeneratePDFButton />
        </Button>
      </div>
    </div>
  );
}
