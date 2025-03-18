import type { DeepPartial } from "ai";
import { z } from "zod";

const tailoredResumeSchema = z.object({
  resume: z
    .object({
      personalInfo: z
        .object({
          name: z.string().describe("Full name of the candidate."),
          location: z
            .string()
            .describe("City and state of the candidate's location."),
          email: z.string().describe("Email address of the candidate"),
          portfolio: z
            .string()
            .describe("URL of the candidate's portfolio website"),
        })
        .describe("Personal information section of the resume."),

      workExperiences: z
        .array(
          z.object({
            company: z.string().describe("Name of the employer or company."),
            location: z
              .string()
              .describe(
                "Location of the company or where the work was performed."
              ),
            title: z.string().describe("Job title or role of the candidate."),
            date: z
              .string()
              .describe(
                "Employment period in the format '[Start Month Year] - [End Month Year]' or '[Start Month Year] - Present'."
              ),
            description: z
              .array(z.string())
              .min(3)
              .max(5)
              .describe(
                "3-5 Tailored bullet points describing key achievements. Each bullet should follow the XYZ format: I did X, using Y, as measured by Z. Start each bullet with an action verb and focus on quantifiable impact and relevant skills. ALWAYS provide at least 3 descriptions. Do not invent or exaggerate experiences. If adding details to meet the minimum requirement, use conservative estimates and qualify them with phrases like 'approximately' or 'estimated'."
              ),
          })
        )
        .describe(
          "Work experience section, including internships and relevant professional experiences tailored for the job."
        ),

      education: z
        .object({
          university: z
            .string()
            .describe("Name of the university or educational institution."),
          degree: z.string().describe("Degree program and major."),
          gpa: z.string().describe("GPA if 3.5 or higher. Omit if lower."),
          graduationDate: z
            .string()
            .describe(
              "Expected graduation date in the format 'Expected [Month Year]'."
            ),
        })
        .describe("Education section of the resume."),

      skills: z
        .string()
        .describe(
          "List of technical skills, programming languages, tools, and frameworks the candidate is proficient in. Separate different categories (e.g., 'Languages:', 'Frameworks:') for clarity."
        ),

      projects: z
        .array(
          z.object({
            id: z.number().describe("Unique identifier for the project entry."),
            name: z.string().describe("Name of the project."),
            description: z
              .array(z.string())
              .min(1)
              .max(5)
              .optional()
              .describe(
                "1-5 Detailed description of the project (1-3 sentences) covering: 1) The problem or challenge addressed, 2) The solution implemented, 3) Technologies and methodologies used.Do not invent projects or exaggerate their scope. Stick to the facts provided in the original resume."
              ),
            technologies: z
              .string()
              .describe(
                "Comprehensive list of technologies, languages, frameworks, and tools used in the project."
              ),
            link: z
              .string()
              .optional()
              .describe(
                "URL to the project repository, deployed version, or demo, if applicable."
              ),
          })
        )
        .describe(
          "Projects section, highlighting relevant technical projects in detail. Each project should demonstrate technical skills, problem-solving abilities, and impact."
        ),
    })
    .describe(
      "Complete structure of a tailored resume, limited to one page, with content adjusted to highlight skills and experiences most relevant to the job description."
    ),
});

type ResumeSchema = z.infer<typeof tailoredResumeSchema>;

const ResumeSchema = z.object({
  resume: z
    .object({
      personalInfo: z
        .object({
          name: z.string().optional().describe("Full name of the candidate."),
          location: z
            .string()
            .optional()
            .describe("City and state of the candidate's location."),
          email: z
            .string()
            .optional()
            .describe("Email address of the candidate"),
          portfolio: z
            .string()
            .optional()
            .describe("URL of the candidate's portfolio website"),
        })
        .partial()
        .describe("Personal information section of the resume."),

      workExperiences: z
        .array(
          z
            .object({
              company: z
                .string()
                .optional()
                .describe("Name of the employer or company."),
              location: z
                .string()
                .optional()
                .describe(
                  "Location of the company or where the work was performed."
                ),
              title: z
                .string()
                .optional()
                .describe("Job title or role of the candidate."),
              date: z
                .string()
                .optional()
                .describe(
                  "Employment period in the format '[Start Month Year] - [End Month Year]' or '[Start Month Year] - Present'."
                ),
              description: z
                .array(z.string())
                .optional()
                .describe("bullet points describing key achievements."),
            })
            .partial()
        )
        .optional()
        .describe(
          "Work experience section, including internships and relevant professional experiences tailored for the job."
        ),

      education: z
        .object({
          university: z
            .string()
            .optional()
            .describe("Name of the university or educational institution."),
          degree: z.string().optional().describe("Degree program and major."),
          gpa: z.string().optional().describe("GPA"),
          graduationDate: z
            .string()
            .optional()
            .describe(
              "Expected graduation date in the format 'Expected [Month Year]'."
            ),
        })
        .partial()
        .optional()
        .describe("Education section of the resume."),

      skills: z
        .string()
        .optional()
        .describe(
          "List of technical skills, programming languages, tools, and frameworks the candidate is proficient in. Separate different categories (e.g., 'Languages:', 'Frameworks:') for clarity."
        ),

      projects: z
        .array(
          z
            .object({
              id: z
                .number()
                .optional()
                .describe("Unique identifier for the project entry."),
              name: z.string().optional().describe("Name of the project."),
              description: z
                .array(z.string())
                .optional()
                .describe(
                  "Bullet points describing the project details, including problem addressed, solution implemented, technologies used, role, and impact."
                ),
              technologies: z
                .string()
                .optional()
                .describe(
                  "Comprehensive list of technologies, languages, frameworks, and tools used in the project."
                ),
              link: z
                .string()
                .optional()
                .describe(
                  "URL to the project repository, deployed version, or demo, if applicable."
                ),
            })
            .partial()
        )
        .optional()
        .describe(
          "Projects section, highlighting relevant technical projects in detail. Each project should demonstrate technical skills, problem-solving abilities, and impact."
        ),
    })
    .partial()
    .describe(
      "Complete structure of a tailored resume, limited to one page, with content adjusted to highlight skills and experiences most relevant to the job description."
    ),
});


export {ResumeSchema, tailoredResumeSchema};

// Define a type for the partial resume during generation
export type PartialResume = DeepPartial<
  z.infer<typeof tailoredResumeSchema>["resume"]
>;
