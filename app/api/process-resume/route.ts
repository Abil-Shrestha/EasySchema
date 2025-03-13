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
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting logic
    const ip = req.ip ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please wait a moment before trying again.",
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
          limit,
          remaining
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString()
          },
        }
      );
    }

    const body = await req.json();
    console.log("Received request body:", body);

    if (!body.resumeText) {
      console.error("No resume text provided in request");
      return NextResponse.json(
        {
          error: "Missing resume text",
          message: "No resume text was provided in the request. Please ensure you're sending a valid resume text.",
          details: "The request body must include a 'resumeText' field with the content to process."
        },
        { status: 400 }
      );
    }

    if (body.resumeText.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Empty resume text",
          message: "The provided resume text is empty. Please ensure the PDF contains text content.",
          details: "The resume text must contain actual content to process."
        },
        { status: 400 }
      );
    }

    console.log("Processing resume text of length:", body.resumeText.length);

    const result = await streamObject({
      model: google("gemini-2.0-flash-001"),
      system: `You are an AI assistant designed to extract structured information from resumes. Your task is to analyze the given resume text and extract relevant information according to the provided schema. Follow these strict guidelines:

1. Extract information EXACTLY as it appears in the resume. Do not modify, enhance, or add any information.
2. If a field in the schema is not present in the resume, leave it blank or null.
3. Do not make assumptions or inferences about missing information.
4. Maintain the original wording and formatting of the resume content as much as possible within the constraints of the schema.
5. For work experiences and projects, extract only the information that is explicitly stated in the resume.`,
      prompt: `Extract the relevant information from the following resume text and format it according to the provided schema. Remember to extract the information exactly as it appears without any modifications:

${body.resumeText}

IMPORTANT: Ensure that you only extract information that is explicitly stated in the resume. Do not add, modify, or enhance any information.`,
      schema: tailoredResumeSchema,
      onFinish: async ({ object }) => {
        console.log("AI processing complete, validating response...");
        if (!object) {
          throw new Error("AI response is empty");
        }
        if (!object.resume) {
          throw new Error("AI response missing resume data");
        }
        console.log("Resume data validation successful");
      },
    });

    console.log("Preparing response stream...");
    const response = result.toTextStreamResponse();

    // Add rate limit headers to the response
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    console.error("Error processing resume:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    // Categorize errors for better client handling
    let statusCode = 500;
    let errorType = "Internal Server Error";
    let userMessage = "An unexpected error occurred while processing your resume.";

    if (error instanceof Error) {
      if (error.message.includes("AI response is empty")) {
        statusCode = 422;
        errorType = "AI Processing Error";
        userMessage = "The AI model failed to process the resume content. Please try again.";
      } else if (error.message.includes("AI response missing resume data")) {
        statusCode = 422;
        errorType = "Invalid AI Response";
        userMessage = "The AI model returned an invalid response format. Please try again.";
      } else if (error.message.includes("timeout")) {
        statusCode = 504;
        errorType = "Timeout Error";
        userMessage = "The request timed out. Please try again.";
      }
    }

    return NextResponse.json({
      error: errorType,
      message: userMessage,
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: statusCode });
  }
}
