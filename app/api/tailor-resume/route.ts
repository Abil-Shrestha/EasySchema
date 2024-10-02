import {tailoredResumeSchema} from "@/lib/schema";
import {openai} from "@ai-sdk/openai";
import {streamObject} from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const {currentResume, jobDescription} = await req.json();

    const result = await streamObject({
      model: openai("gpt-4o-mini"), // Note: Changed from "gpt-4o-mini" to a valid model name
      system: `You are an expert resume tailoring AI. Your task is to analyze the given job description and modify the provided resume to better match the job requirements. Follow the structure and guidelines defined in the schema, ensuring that the tailored resume is professional, relevant, and adheres to best practices in resume writing.`,
      prompt: `Given the following current resume and job description, create a tailored version of the resume that better matches the job requirements:

      Current Resume: ${JSON.stringify(currentResume, null, 2)}
      Job Description: ${jobDescription}`,
      schema: tailoredResumeSchema,
      onFinish: async ({object}) => {
        console.log("Object from openai is:", JSON.stringify(object));
      },
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
