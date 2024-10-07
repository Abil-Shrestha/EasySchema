import {tailoredResumeSchema} from "@/lib/schema";
import {openai} from "@ai-sdk/openai";
import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
import {streamObject} from "ai";
import {type NextRequest, NextResponse} from "next/server";

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
    const {success, limit, reset, remaining} = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {error: "Too many requests"},
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
        console.log("Extracted resume information:", object);
      },
    });

    const response = result.toTextStreamResponse();

    // Add rate limit headers to the response
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json({error: "Error processing resume"}, {status: 500});
  }
}
