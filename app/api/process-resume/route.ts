import { ResumeSchema, tailoredResumeSchema } from "@/lib/schema";
import { google } from '@ai-sdk/google';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { streamObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Create a new ratelimiter, that allows 5 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export async function POST(req: NextRequest) {
  console.log("API route started")

  try {
    // Rate limiting logic
    const ip = req.ip ?? "127.0.0.1"
    console.log("Checking rate limit for IP:", ip)

    let rateLimitResult
    try {
      rateLimitResult = await ratelimit.limit(ip)
      console.log("Rate limit check result:", rateLimitResult)
    } catch (rateLimitError) {
      console.error("Rate limit check failed:", rateLimitError)
      rateLimitResult = {
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 60000,
      }
    }

    const { success, limit, reset, remaining } = rateLimitResult

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please wait a moment before trying again.",
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
          limit,
          remaining,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // Parse request body
    let body
    try {
      body = await req.json()
      console.log("Request body parsed successfully")
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Failed to parse request body. Please ensure you're sending valid JSON.",
        },
        { status: 400 },
      )
    }

    // Validate resume text
    if (!body.resumeText) {
      console.error("No resume text provided in request")
      return NextResponse.json(
        {
          error: "Missing resume text",
          message: "No resume text was provided in the request.",
        },
        { status: 400 },
      )
    }

    if (body.resumeText.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Empty resume text",
          message: "The provided resume text is empty.",
        },
        { status: 400 },
      )
    }

    console.log("Processing resume text of length:", body.resumeText.length)

    try {
      // IMPORTANT: This is the key change - we need to ensure the response is properly formatted
      // for the experimental_useObject hook from @ai-sdk/react
      const result = streamObject({
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
        schema: ResumeSchema,
      })

      console.log("Response stream prepared successfully")
      return result.toTextStreamResponse()
    } catch (aiError) {
      console.error("Error with AI processing:", aiError)
      return NextResponse.json(
        {
          error: "AI Processing Error",
          message: "Failed to process the resume with AI",
          details: aiError instanceof Error ? aiError.message : "Unknown AI error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing resume:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while processing your resume.",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

