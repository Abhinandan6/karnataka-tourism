"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function TripPlanner() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerateTrip = async () => {
    if (!prompt.trim()) {
      setError("Please enter a trip description")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate trip plan")
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Header with background image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-amber-700/70"></div>
        <img
          src="/placeholder.svg?height=400&width=1200"
          alt="Karnataka landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 text-center px-4 font-josefin drop-shadow-lg">
            Plan Your Karnataka Trip
          </h1>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-amber-800 hover:text-amber-600 mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-josefin">Back to Home</span>
        </button>

        {/* Trip planner form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-amber-200">
          <p className="text-amber-900 mb-4 font-josefin">
            Describe your ideal Karnataka trip and our AI will create a personalized itinerary for you.
          </p>
          <p className="text-amber-700 mb-6 text-sm">
            Example: "Plan a 5-day trip to Coorg for nature and food" or "3-day cultural tour of Hampi"
          </p>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream Karnataka trip..."
            className="min-h-32 mb-4 border-amber-300 focus:border-amber-500 focus:ring-amber-500 font-josefin"
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Button
            onClick={handleGenerateTrip}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white font-josefin py-3"
          >
            {isLoading ? "Generating Trip Plan..." : "Generate Trip"}
          </Button>
        </div>

        {/* Results section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-amber-900 font-josefin">Your Personalized Trip Plan</h2>
            <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        )}
      </div>
    </main>
  )
}
