import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { blogTitle, category } = await request.json()

    if (!blogTitle) {
      return NextResponse.json({ error: "Blog title is required" }, { status: 400 })
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI API not configured" }, { status: 500 })
    }

    const prompt = `You are an expert organic living and sustainability blogger. Create SEO-optimized blog content for an organic e-commerce site.

Blog Title: ${blogTitle}
Category: ${category || "Wellness"}

Generate ONLY valid JSON (no markdown) with this structure:
{
  "excerpt": "Compelling 1-2 sentence summary (under 150 chars)",
  "content": "Well-structured, informative blog post (800-1000 words) with clear sections using markdown headers. Focus on practical tips, benefits, and organic lifestyle guidance. Include natural keyword integration.",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "metaDescription": "SEO meta description under 160 characters"
}

Make content informative, conversion-focused (encouraging organic product usage), and optimized for search engines.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Gemini API error:", error)
      return NextResponse.json(
        {
          error: "Failed to generate blog content",
          details: error?.error?.message || "Unknown error",
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      console.error("[v0] No content in Gemini response:", data)
      return NextResponse.json({ error: "No content generated" }, { status: 500 })
    }

    let jsonContent = content.trim()
    if (jsonContent.includes("```json")) {
      jsonContent = jsonContent.split("```json")[1]?.split("```")[0]?.trim() || jsonContent
    } else if (jsonContent.includes("```")) {
      jsonContent = jsonContent.split("```")[1]?.split("```")[0]?.trim() || jsonContent
    }

    let generated
    try {
      generated = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError, "Content:", jsonContent)
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          details: "Invalid JSON format",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      excerpt: generated.excerpt || "",
      content: generated.content || "",
      seoDescription: generated.metaDescription || "",
      keywords: generated.seoKeywords || [],
    })
  } catch (error) {
    console.error("[v0] Blog content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate blog content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
