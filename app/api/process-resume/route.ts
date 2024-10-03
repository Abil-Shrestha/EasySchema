import {tailoredResumeSchema} from "@/lib/schema";
import {openai} from "@ai-sdk/openai";
import {streamObject} from "ai";
import {NextRequest, NextResponse} from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const {resumeText} = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        {error: "No resume text provided"},
        {status: 400}
      );
    }

    const result = await streamObject({
      model: openai("gpt-4o-mini"),
      system: `You are an AI assistant designed to extract structured information from resumes. Your task is to analyze the given resume text and extract relevant information according to the provided schema. Follow these strict guidelines:

1. Extract information EXACTLY as it appears in the resume. Do not modify, enhance, or add any information.
2. If a field in the schema is not present in the resume, leave it blank or null.
3. Do not make assumptions or inferences about missing information.
4. Maintain the original wording and formatting of the resume content as much as possible within the constraints of the schema.
5. For work experiences and projects, extract only the information that is explicitly stated in the resume.`,
      prompt: `Extract the relevant information from the following resume text and format it according to the provided schema. Remember to extract the information exactly as it appears without any modifications:

${resumeText}

IMPORTANT: Ensure that you only extract information that is explicitly stated in the resume. Do not add, modify, or enhance any information.`,
      schema: tailoredResumeSchema,
      onFinish: async ({object}) => {
        console.log("Extracted resume information:", object && object.resume);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json({error: "Error processing resume"}, {status: 500});
  }
}
