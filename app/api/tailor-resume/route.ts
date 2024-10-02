import {tailoredResumeSchema} from "@/lib/schema";
import {openai} from "@ai-sdk/openai";
import {streamObject} from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const {currentResume, jobDescription} = await req.json();

    const result = await streamObject({
      model: openai("gpt-4o-mini"), // Note: Changed from "gpt-4o-mini" to a valid model name
      system: `You are an expert resume tailoring AI. Your task is to analyze the given job description and modify the provided resume to better match the job requirements. Follow these strict guidelines:

1. Adhere to the structure and guidelines defined in the schema.
2. Ensure the tailored resume is professional, relevant, and follows best practices in resume writing.
3. For each work experience entry, ALWAYS provide AT LEAST 3 descriptions, even if the original resume had fewer.
4. Each description should follow the XYZ format: "I did X, using Y, as measured by Z."
5. Start each description with a strong action verb.
6. Focus on quantifiable achievements and impacts relevant to the job description.
7. If the original resume lacks sufficient detail, use your expertise to expand and enhance the descriptions based on the job requirements.`,
      prompt: `Given the following current resume and job description, create a tailored version of the resume that better matches the job requirements:

      Current Resume: ${JSON.stringify(currentResume, null, 2)}
      Job Description: ${jobDescription}
      
      IMPORTANT: Review your output before finalizing. If any work experience has fewer than 3 descriptions, add more to meet the minimum requirement.`,
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
