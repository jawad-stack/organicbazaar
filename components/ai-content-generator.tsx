"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIContentGeneratorProps {
  type: "product" | "blog"
  onContentGenerated: (content: any) => void
}

export function AIContentGenerator({ type, onContentGenerated }: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const endpoint = type === "product" ? "/api/ai/generate-product-content" : "/api/ai/generate-blog-content"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [type === "product" ? "productTitle" : "blogTitle"]: title,
          category,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      toast({ title: "Success", description: "Content generated successfully" })
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleUse = () => {
    onContentGenerated(generatedContent)
    setIsOpen(false)
    setGeneratedContent(null)
    setTitle("")
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="border-primary/30 text-primary hover:bg-primary/5"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        AI Generate
      </Button>

      {isOpen && (
        <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
          {!generatedContent ? (
            <>
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {type === "product" ? "Product" : "Blog"} Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === "product" ? "e.g., Organic Green Tea" : "e.g., Benefits of Organic Living"}
                  className="mt-1"
                />
              </div>

              {type === "blog" && (
                <div>
                  <label className="text-sm font-semibold text-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground"
                  >
                    <option value="">Select a category</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Education">Education</option>
                    <option value="Recipes">Recipes</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !title.trim()}
                className="w-full bg-gradient-to-r from-primary to-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(generatedContent).map(([key, value]) => {
                if (key === "content") return null
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground capitalize">{key}</label>
                      <button
                        onClick={() => copyToClipboard(String(value), key)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        {copied === key ? (
                          <>
                            <Check className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-xs bg-background/50 p-2 rounded border border-border/30 text-foreground line-clamp-2">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </div>
                  </div>
                )
              })}

              {generatedContent.content && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Content Preview</label>
                  <div className="text-xs bg-background/50 p-2 rounded border border-border/30 text-foreground line-clamp-3 whitespace-pre-wrap">
                    {generatedContent.content}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={handleUse} className="flex-1 bg-accent hover:bg-accent/90" size="sm">
                  Use Content
                </Button>
                <Button
                  onClick={() => {
                    setGeneratedContent(null)
                    setTitle("")
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Generate Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
