import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from 'zod';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Define the schema for the tailored resume using Zod
const tailoredResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    location: z.string(),
    email: z.string(),
    portfolio: z.string(),
  }),
  workExperiences: z.array(z.object({
    id: z.number(),
    company: z.string(),
    location: z.string(),
    title: z.string(),
    date: z.string(),
    description: z.array(z.string()),
  })),
  education: z.object({
    university: z.string(),
    degree: z.string(),
    gpa: z.string(),
    graduationDate: z.string(),
  }),
  skills: z.string(),
  projects: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    technologies: z.string(),
  })),
});

export async function POST(req: Request) {
  try {
    const { currentResume, jobDescription } = await req.json();

    const result = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: tailoredResumeSchema,
      system: `You are an expert resume tailoring AI. Your task is to analyze the given job description and modify the provided resume to better match the job requirements. Follow these guidelines:

1. Maintain the overall structure of the resume.
2. Adjust the content to highlight skills and experiences that are most relevant to the job description.
3. Reword bullet points to use keywords from the job description where appropriate.
4. Keep the personal information (name, contact details) unchanged.
5. Modify the skills section to prioritize skills mentioned in the job description.
6. Adjust project descriptions to emphasize aspects that align with the job requirements.
7. Do not invent new experiences or skills; only work with the information provided in the current resume.
8. Ensure that the tailored resume maintains a professional tone and remains truthful to the original content.`,
      prompt: `Given the following current resume and job description, create a tailored version of the resume that better matches the job requirements:

Current Resume:
${JSON.stringify(currentResume, null, 2)}

Job Description:
${jobDescription}

Please provide a tailored version of the resume that better matches this job description.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in tailor-resume API:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}