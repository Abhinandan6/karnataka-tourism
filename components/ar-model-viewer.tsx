"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

// Add type declaration for model-viewer custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        poster?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
      }, HTMLElement>;
    }
  }
}

interface ARModelViewerProps {
  src: string
  alt: string
  poster?: string
  iosSrc?: string
  arScale?: string
  arPlacement?: string
  className?: string
}

export function ARModelViewer({
  src,
  alt,
  poster,
  iosSrc,
  arScale = "auto",
  arPlacement = "floor",
  className = "",
}: ARModelViewerProps) {
  const modelViewerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Add any initialization code here if needed
    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <>
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        strategy="afterInteractive"
      />

      <div className={`ar-model-container ${className}`}>
        {/* Now we can use model-viewer without @ts-ignore */}
        <model-viewer
          ref={modelViewerRef}
          src={src}
          ios-src={iosSrc}
          alt={alt}
          poster={poster}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale={arScale}
          ar-placement={arPlacement}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          environment-image="neutral"
          exposure="0.8"
          style={{ width: "100%", height: "100%" }}
        >
          <button
            slot="ar-button"
            className="ar-button bg-amber-600 hover:bg-amber-700 text-white font-josefin py-2 px-4 rounded-full shadow-md flex items-center justify-center gap-2 absolute bottom-4 right-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"
                fill="currentColor"
              />
              <path
                d="M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6Z"
                fill="currentColor"
              />
              <path
                d="M6 9C7.65685 9 9 7.65685 9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9Z"
                fill="currentColor"
              />
              <path
                d="M14.5 16.5C14.5 17.8807 13.3807 19 12 19C10.6193 19 9.5 17.8807 9.5 16.5C9.5 15.1193 10.6193 14 12 14C13.3807 14 14.5 15.1193 14.5 16.5Z"
                fill="currentColor"
              />
              <path
                d="M14.5 16.5C14.5 17.8807 13.3807 19 12 19C10.6193 19 9.5 17.8807 9.5 16.5C9.5 15.1193 10.6193 14 12 14C13.3807 14 14.5 15.1193 14.5 16.5Z"
                fill="currentColor"
              />
              <path
                d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z"
                fill="currentColor"
              />
              <path
                d="M8 18.5C8 19.8807 6.88071 21 5.5 21C4.11929 21 3 19.8807 3 18.5C3 17.1193 4.11929 16 5.5 16C6.88071 16 8 17.1193 8 18.5Z"
                fill="currentColor"
              />
            </svg>
            View in AR
          </button>

          <div className="progress-bar hide" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
        </model-viewer>
      </div>
    </>
  )
}
