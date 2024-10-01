import {openai} from "@ai-sdk/openai";
import {streamObject} from "ai";
import {z} from "zod";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;
// Define the schema for the tailored resume using Zod with detailed descriptions
const tailoredResumeSchema = z
  .object({
    personalInfo: z
      .object({
        name: z.string().describe("Full name of the candidate."),
        location: z
          .string()
          .describe("City and state of the candidate's location."),
        email: z
          .string()
          .describe(
            "Personal email address of the candidate (not school email)."
          ),
        portfolio: z
          .string()
          .describe(
            "URL of the candidate's portfolio website or LinkedIn profile."
          ),
      })
      .describe("Personal information section of the resume."),

    workExperiences: z
      .array(
        z.object({
          id: z
            .number()
            .describe("Unique identifier for the work experience entry."),
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
              "3-5 bullet points describing key achievements. Each bullet should follow the XYZ format: I did X, using Y, as measured by Z. Start each bullet with an action verb and focus on quantifiable impact and relevant skills."
            ),
        })
      )
      .describe(
        "Work experience section, including internships and relevant professional experiences."
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
            .string()
            .describe(
              "Detailed description of the project (3-5 sentences) covering: 1) The problem or challenge addressed, 2) The solution implemented, 3) Technologies and methodologies used, 4) Your specific role and contributions, 5) Quantifiable results or impact. Use technical language relevant to the job description."
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
  );

export async function POST(req: Request) {
  try {
    const {currentResume, jobDescription} = await req.json();

    const result = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: tailoredResumeSchema,
      system: `You are an expert resume tailoring AI. Your task is to analyze the given job description and modify the provided resume to better match the job requirements. Follow the structure and guidelines defined in the schema, ensuring that the tailored resume is professional, relevant, and adheres to best practices in resume writing.`,
      prompt: `Given the following current resume and job description, create a tailored version of the resume that better matches the job requirements:

Current Resume:
${JSON.stringify(currentResume, null, 2)}

Job Description:
${jobDescription}

Please provide a tailored version of the resume that better matches this job description.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in tailor-resume API:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: {"Content-Type": "application/json"},
      }
    );
  }
}
