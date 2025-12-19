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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
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
            maxOutputTokens: 800,
          },
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Gemini API error:", error)
      return NextResponse.json(
        {
          error: "Failed to generate content",
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
      description: generated.description || "",
      seoDescription: generated.seoDescription || "",
      keywords: generated.seoKeywords || [],
      benefits: generated.benefits || [],
      shortDescription: generated.shortDescription || "",
    })
  } catch (error) {
    console.error("[v0] Content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
