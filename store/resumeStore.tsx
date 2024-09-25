import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PersonalInfo {
  name: string;
  location: string;
  email: string;
  portfolio: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  location: string;
  title: string;
  date: string;
  description: string[];
}

export interface Education {
  university: string;
  degree: string;
  gpa: string;
  graduationDate: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string;
}

export interface ResumeState {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  education: Education;
  skills: string;
  projects: Project[];
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (updatedExperience: WorkExperience) => void;
  removeWorkExperience: (id: number) => void;
  updateEducation: (field: keyof Education, value: string) => void;
  updateSkills: (skills: string) => void;
  addProject: () => void;
  updateProject: (updatedProject: Project) => void;
  removeProject: (id: number) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      personalInfo: {
        name: '',
        location: '',
        email: '',
        portfolio: '',
      },
      workExperiences: [],
      education: {
        university: '',
        degree: '',
        gpa: '',
        graduationDate: '',
      },
      skills: '',
      projects: [],

      updatePersonalInfo: (field, value) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, [field]: value },
        })),

      addWorkExperience: () =>
        set((state) => ({
          workExperiences: [
            ...state.workExperiences,
            {
              id: Date.now(),
              company: '',
              location: '',
              title: '',
              date: '',
              description: [''],
            },
          ],
        })),

      updateWorkExperience: (updatedExperience) =>
        set((state) => ({
          workExperiences: state.workExperiences.map((exp) =>
            exp.id === updatedExperience.id ? updatedExperience : exp
          ),
        })),

      removeWorkExperience: (id) =>
        set((state) => ({
          workExperiences: state.workExperiences.filter((exp) => exp.id !== id),
        })),

      updateEducation: (field, value) =>
        set((state) => ({
          education: { ...state.education, [field]: value },
        })),

      updateSkills: (skills) => set({ skills }),

      addProject: () =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: Date.now(),
              name: '',
              description: '',
              technologies: '',
            },
          ],
        })),

      updateProject: (updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
    }),
    {
      name: 'resume-storage',
    }
  )
);