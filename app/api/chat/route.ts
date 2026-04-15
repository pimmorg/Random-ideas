import Anthropic from "@anthropic-ai/sdk"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

const client = new Anthropic()

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { messages, lessonContext } = await req.json()

  // Get user's active track for context
  const userTrack = await db.userTrack.findFirst({
    where: { userId: session.user.id, isActive: true },
    include: { track: { select: { name: true } } },
  })

  const trackName = userTrack?.track.name ?? "Private Pilot"

  const systemPrompt = `You are an expert FAA-certified flight instructor and AI tutor for SkySchool, a pilot study platform.

The student is currently working on their ${trackName} certification.${lessonContext ? ` They are studying: "${lessonContext}".` : ""}

Your role:
- Answer aviation questions accurately, citing FARs and AIM where applicable
- Adapt explanations to the student's level (they're studying ${trackName})
- Use real-world aviation examples to make concepts concrete
- Keep responses concise but thorough — aim for 2-4 paragraphs max
- Use markdown formatting (bold for key terms, bullet points for lists)
- If asked to quiz the student, provide one practice question at a time with 4 options labeled A-D
- NEVER confuse or overwhelm — be like a patient ground instructor

IMPORTANT DISCLAIMER: You are a study aid. Always remind students when appropriate that a certified CFI should be consulted for actual flight training decisions, and that this platform does not satisfy FAA training requirements.

If the student asks about topics beyond their current track, you may briefly explain but redirect them to focus on their current certification first.`

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.slice(-10), // Keep last 10 for context window management
  })

  // Return SSE stream
  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ delta: { text: event.delta.text } })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
