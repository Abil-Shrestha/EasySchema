import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PersonalInfo {
  name: string;
  location: string;
  email: string;
  portfolio: string;
}

export interface WorkExperience {
  id?: number;
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
  id?: number;
  name: string;
  description: string[];
  technologies: string;
}

export interface UpdatedResumeState {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  education: Education;
  skills: string;
  projects: Project[];
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  updateWorkExperiences: (newWorkExperiences: WorkExperience[]) => void;
  addWorkExperience: (experience: Omit<WorkExperience, 'id'>) => void;
  updateWorkExperience: (updatedExperience: WorkExperience) => void;
  removeWorkExperience: (id: number) => void;
  updateEducation: (field: keyof Education, value: string) => void;
  updateSkills: (skills: string) => void;
  updateProjects: (newProjects: Project[]) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (updatedProject: Project) => void;
  removeProject: (id: number) => void;
  clearUpdatedResume: () => void;
  highlightList: boolean;
  setHighlightList: (value: boolean) => void;
}

const initialResume: Omit<
  UpdatedResumeState,
  keyof Omit<
    UpdatedResumeState,
    "personalInfo" | "workExperiences" | "education" | "skills" | "projects"
  >
> = {
  personalInfo: {
    name: "",
    location: "",
    email: "",
    portfolio: "",
  },
  workExperiences: [],
  education: {
    university: "",
    degree: "",
    gpa: "",
    graduationDate: "",
  },
  skills: "",
  projects: [],
};

export const useUpdatedResumeStore = create<UpdatedResumeState>()(
  persist(
    (set) => ({
      ...initialResume,


      highlightList: false,
      setHighlightList: (value) => set({ highlightList: value }),


      updatePersonalInfo: (field, value) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, [field]: value },
        })),

      updateWorkExperiences: (newWorkExperiences) =>
        set((state) => ({
          workExperiences: newWorkExperiences.map((exp, index) => ({
            ...exp,
            id: exp.id || Date.now() + index,
          })),
        })),

      addWorkExperience: (experience) =>
        set((state) => ({
          workExperiences: [
            ...state.workExperiences,
            { ...experience, id: Date.now() },
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

      updateProjects: (newProjects) =>
        set((state) => ({
          projects: newProjects.map((proj, index) => ({
            ...proj,
            id: proj.id || Date.now() + index,
          })),
        })),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: Date.now() }],
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

      clearUpdatedResume: () => set(initialResume),
    }),
    {
      name: "updated-resume-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);