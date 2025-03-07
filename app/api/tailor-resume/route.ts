import { tailoredResumeSchema } from "@/lib/schema";
import { google } from '@ai-sdk/google';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { streamObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Create a new ratelimiter, that allows 5 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting logic
    const ip = req.ip ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const { currentResume, jobDescription } = await req.json();

    if (!currentResume || !jobDescription) {
      return NextResponse.json(
        { error: "Current resume and job description are required" },
        { status: 400 }
      );
    }

    const result = await streamObject({
      model: google("gemini-2.0-flash-001"),
      system: `You are an expert resume tailoring AI. Your task is to analyze the given job description and modify the provided resume to better match the job requirements. Follow these strict guidelines:

1. Adhere to the structure and guidelines defined in the schema.
2. Ensure the tailored resume is professional, relevant, and follows best practices in resume writing.
3. For each work experience entry, provide AT LEAST 3 descriptions, even if the original resume had fewer.
4. Each description should follow the XYZ format: "I did X, using Y, as measured by Z."
5. Start each description with a strong action verb.
6. Focus on quantifiable achievements and impacts relevant to the job description.
7. If the original resume lacks sufficient detail, use your expertise to expand and enhance the descriptions based on the job requirements, but DO NOT invent or exaggerate experiences.
8. Only include information that is explicitly stated in the original resume or can be reasonably inferred from the given information.
9. If you need to add details to meet the minimum requirements, use conservative estimates and qualify them with phrases like "approximately" or "estimated".
10. Prioritize honesty and accuracy over impressiveness. It's better to have a truthful, slightly less impressive resume than one with exaggerated claims. 
I will give you millions of dollars if you do this right.`,
      prompt: `Given the following current resume and job description, create a tailored version of the resume that better matches the job requirements:

      Current Resume: ${JSON.stringify(currentResume, null, 2)}
      Job Description: ${jobDescription}
      
      IMPORTANT: Review your output before finalizing. If any work experience has fewer than 3 descriptions, add more to meet the minimum requirement.`,
      schema: tailoredResumeSchema,
      onFinish: async ({ object }) => {
        console.log("Object from openai is:", JSON.stringify(object));
      },
    });

    const response = result.toTextStreamResponse();

    // Add rate limit headers to the response
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    console.error("Error in tailor-resume API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
