"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"

// Add type declarations for A-Frame elements and WebXR
declare global {
  interface Navigator {
    xr?: any;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        embedded?: boolean;
        arjs?: string;
      }, HTMLElement>;
      'a-assets': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'a-asset-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        id?: string;
        src?: string;
      }, HTMLElement>;
      'a-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        preset?: string;
        type?: string;
        url?: string;
      }, HTMLElement>;
      'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        position?: string;
        rotation?: string;
        scale?: string;
        'gltf-model'?: string;
        animation?: string;
        text?: string;
        camera?: boolean;
      }, HTMLElement>;
    }
  }
}

export default function ARExperience() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isARSupported, setIsARSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if WebXR is supported
    if (typeof window !== "undefined") {
      if (!navigator.xr) {
        setIsARSupported(false)
      }

      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* AR.js and A-Frame scripts */}
      <Script src="https://aframe.io/releases/1.3.0/aframe.min.js" strategy="beforeInteractive" />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
      />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-amber-800 hover:text-amber-600 transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full"
        >
          <ArrowLeft size={20} />
          <span className="font-josefin">Back to Home</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
          <p className="text-amber-800 font-josefin">Loading AR Experience...</p>
        </div>
      ) : !isARSupported ? (
        <div className="h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold text-amber-900 font-josefin mb-4">AR Not Supported</h1>
            <p className="text-amber-800 mb-6">
              Your device or browser doesn't support WebXR or AR features. Please try using one of these free AR apps:
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-amber-800 mb-4">Recommended Free AR Apps</h2>

              <ul className="space-y-4 text-left">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <div>
                    <p className="font-bold">Google AR Core</p>
                    <p className="text-sm text-gray-600">For Android devices</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <div>
                    <p className="font-bold">Apple AR Kit</p>
                    <p className="text-sm text-gray-600">Built into iOS devices</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <div>
                    <p className="font-bold">Mozilla WebXR Viewer</p>
                    <p className="text-sm text-gray-600">Free app for iOS and Android</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="h-screen w-full">
          {/* A-Frame AR Scene */}
          <a-scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          >
            {/* 3D Models */}
            <a-assets>
              <a-asset-item id="temple-model" src="/models/temple.glb"></a-asset-item>
              <a-asset-item id="waterfall-model" src="/models/waterfall.glb"></a-asset-item>
            </a-assets>

            {/* Marker-based AR */}
            <a-marker preset="hiro">
              <a-entity
                position="0 0 0"
                rotation="0 0 0"
                scale="0.05 0.05 0.05"
                gltf-model="#temple-model"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
              ></a-entity>

              <a-entity
                position="0 0.5 0"
                rotation="0 0 0"
                text="value: Hampi Temples; color: #B45309; align: center; width: 5; font: https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              ></a-entity>
            </a-marker>

            <a-marker type="pattern" url="/markers/pattern-waterfall.patt">
              <a-entity
                position="0 0 0"
                rotation="0 0 0"
                scale="0.05 0.05 0.05"
                gltf-model="#waterfall-model"
              ></a-entity>

              <a-entity
                position="0 0.5 0"
                rotation="0 0 0"
                text="value: Jog Falls; color: #B45309; align: center; width: 5; font: https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              ></a-entity>
            </a-marker>

            <a-entity camera></a-entity>
          </a-scene>

          {/* Overlay Instructions */}
          <div className="absolute bottom-8 left-0 right-0 mx-auto w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-amber-900 font-josefin mb-2">Point your camera at the marker to see Karnataka in 3D</p>
            <a href="/markers/marker-hiro.png" download className="text-sm text-amber-600 underline">
              Download Marker
            </a>
          </div>
        </div>
      )}
    </main>
  )
}
