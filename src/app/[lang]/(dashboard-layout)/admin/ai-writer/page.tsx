"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

import { usePermission } from "@/hooks/use-permission"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { UnauthorizedState } from "@/components/auth/unauthorized-state"

export default function AdminAiWriterPage() {
  const { can, isLoading: isPermissionLoading } = usePermission()
  const canGenerate = can("aiContent:generate")

  const [productName, setProductName] = useState("")
  const [keySpecs, setKeySpecs] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isPermissionLoading && !canGenerate) {
    return <UnauthorizedState />
  }

  const handleGenerateDescription = async () => {
    setLoading(true)
    // Simulate API call to an LLM
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setOutput(
      `Introducing the ${productName || "New Frame"} — where precision engineering meets timeless design. Crafted from premium materials to ensure lightweight comfort and exceptional durability, these glasses feature a refined silhouette that effortlessly elevates any look. Whether you're at the office or out on the town, the superior lenses provide optical clarity and protection. Details include: ${
        keySpecs || "custom hinges, polished finish, and an adaptive fit."
      }`
    )
    setLoading(false)
  }

  const handleGenerateSeo = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setOutput(
      `Title: Buy ${
        productName || "Premium Eyewear"
      } Online | Lensora\n\nDescription: Shop the new ${
        productName || "Premium Eyewear"
      }. Featuring ${
        keySpecs || "premium materials and timeless design"
      }. Free shipping and returns. Discover the Lensora difference today.`
    )
    setLoading(false)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Writer</h2>
          <p className="text-muted-foreground">
            Generate high-converting product descriptions and SEO metadata.
          </p>
        </div>
      </div>

      <Tabs defaultValue="description" className="space-y-4">
        <TabsList>
          <TabsTrigger value="description">Product Description</TabsTrigger>
          <TabsTrigger value="seo">SEO Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name1">Product Name</Label>
                <Input
                  id="name1"
                  placeholder="e.g. Apex Sport Wrap"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specs1">Key Specs / Keywords</Label>
                <Input
                  id="specs1"
                  placeholder="e.g. TR90, polarized, anti-slip, lightweight"
                  value={keySpecs}
                  onChange={(e) => setKeySpecs(e.target.value)}
                />
              </div>
              <Button
                onClick={handleGenerateDescription}
                disabled={loading || !productName}
                className="w-full sm:w-auto"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate Description"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate SEO Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name2">Product Name</Label>
                <Input
                  id="name2"
                  placeholder="e.g. Apex Sport Wrap"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specs2">Target Keywords</Label>
                <Input
                  id="specs2"
                  placeholder="e.g. sport sunglasses, running glasses"
                  value={keySpecs}
                  onChange={(e) => setKeySpecs(e.target.value)}
                />
              </div>
              <Button
                onClick={handleGenerateSeo}
                disabled={loading || !productName}
                className="w-full sm:w-auto"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate SEO Meta"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Output Area */}
      {output && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Generated Output</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
              >
                Copy Text
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea readOnly value={output} className="min-h-[150px]" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
