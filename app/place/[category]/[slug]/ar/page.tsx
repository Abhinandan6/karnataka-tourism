"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ARModelViewer } from "@/components/ar-model-viewer"
import { use } from "react"

export default function PlaceARPage({ params }: { params: { category: string; slug: string } }) {
  const router = useRouter()
  // Fix the TypeScript error by properly typing the unwrapped params
  // In your AR page file
  const unwrappedParams = use(params as unknown as Promise<{ category: string; slug: string }>)
  const { category, slug } = unwrappedParams

  // Get AR model data based on category and slug
  const getARModelData = () => {
    // This is a mock implementation - in a real app, you would fetch this data from an API or database
    const arModelsData: Record<string, Record<string, any>> = {
      waterfalls: {
        "jog-falls": {
          name: "Jog Falls",
          modelSrc: "/models/jog-falls.glb", // Replace with actual model path
          iosSrc: "/models/jog-falls.usdz", // Replace with actual model path for iOS
          poster: "/placeholder.svg?height=600&width=800",
          description:
            "Experience the majestic Jog Falls in 3D. Point your camera at a flat surface to place the model.",
        },
      },
      temples: {
        "virupaksha-temple": {
          name: "Virupaksha Temple",
          modelSrc: "/models/virupaksha-temple.glb", // Replace with actual model path
          iosSrc: "/models/virupaksha-temple.usdz", // Replace with actual model path for iOS
          poster: "/placeholder.svg?height=600&width=800",
          description:
            "Explore the ancient Virupaksha Temple in 3D. Point your camera at a flat surface to place the model.",
        },
      },
    }

    // Return the AR model data if it exists, otherwise return a default object
    return (
      (arModelsData[category] && arModelsData[category][slug]) || {
        name: "Model Not Available",
        modelSrc: "/models/default.glb", // Replace with a default model
        iosSrc: "/models/default.usdz", // Replace with a default model for iOS
        poster: "/placeholder.svg?height=600&width=800",
        description: "3D model not available for this location yet.",
      }
    )
  }

  const arModelData = getARModelData()

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push(`/place/${category}/${slug}`)}
          className="flex items-center gap-2 text-amber-800 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-josefin">Back to {arModelData.name}</span>
        </button>

        <h1 className="text-3xl font-bold mb-4 text-amber-900 font-josefin">Experience {arModelData.name} in AR</h1>

        <p className="text-amber-800 mb-8">{arModelData.description}</p>

        {/* AR Model Viewer */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <ARModelViewer
            src={arModelData.modelSrc}
            iosSrc={arModelData.iosSrc}
            alt={`3D model of ${arModelData.name}`}
            poster={arModelData.poster}
            className="h-[500px]"
          />
        </div>

        {/* Instructions */}
        <div className="bg-amber-100 rounded-lg p-6 shadow-md border border-amber-200 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-amber-900 font-josefin">How to View in AR</h2>

          <ol className="list-decimal pl-5 space-y-3 text-amber-800">
            <li>Click the "View in AR" button on the 3D model above</li>
            <li>Allow camera access when prompted</li>
            <li>Point your camera at a flat surface like a floor or table</li>
            <li>Move your phone around until the surface is detected</li>
            <li>The 3D model will appear on the surface</li>
            <li>You can resize the model by pinching with two fingers</li>
          </ol>
        </div>

        {/* Compatibility Information */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-amber-900 font-josefin">Device Compatibility</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-amber-800 mb-2">Android Devices</h3>
              <p className="text-amber-700 mb-2">AR is supported on most Android devices with ARCore. This includes:</p>
              <ul className="list-disc pl-5 text-amber-700">
                <li>Google Pixel devices</li>
                <li>Samsung Galaxy S9 and newer</li>
                <li>OnePlus 6 and newer</li>
                <li>And many other Android 8.0+ devices</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-amber-800 mb-2">iOS Devices</h3>
              <p className="text-amber-700 mb-2">AR is supported on iOS devices with ARKit. This includes:</p>
              <ul className="list-disc pl-5 text-amber-700">
                <li>iPhone 6s and newer</li>
                <li>iPad (5th generation) and newer</li>
                <li>iPad Pro (all models)</li>
                <li>iPad Air (3rd generation) and newer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
