import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productTitle, productCategory } = await request.json()

    if (!productTitle) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 })
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI API not configured" }, { status: 500 })
    }

    const prompt = `You are an expert e-commerce copywriter specializing in organic products. Generate compelling, SEO-optimized product content for an organic e-commerce store.

Product Title: ${productTitle}
Category: ${productCategory || "General"}

Generate ONLY valid JSON (no markdown, no extra text) with this structure:
{
  "description": "Compelling 2-3 sentence product description highlighting benefits and organic nature",
  "seoDescription": "Concise SEO meta description under 160 characters",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "shortDescription": "One catchy line (under 100 chars)"
}

Make all content conversion-focused, emphasize 100% organic/natural aspects, and include relevant keywords for SEO.`

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
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
            maxOutputTokens: 500,
          },
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("Gemini API error:", error)
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 })
    }

    // Parse JSON response, handling potential markdown code blocks
    let jsonContent = content
    if (content.includes("```json")) {
      jsonContent = content.split("```json")[1]?.split("```")[0] || content
    } else if (content.includes("```")) {
      jsonContent = content.split("```")[1]?.split("```")[0] || content
    }

    const generated = JSON.parse(jsonContent.trim())

    return NextResponse.json({
      success: true,
      content: generated,
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
