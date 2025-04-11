"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { QrCode, Smartphone } from "lucide-react"
import Image from "next/image"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const textRef = useRef(null)
  const headerRef = useRef(null)
  const exploreRef = useRef(null)
  const cardsRef = useRef(null)
  const [showArModal, setShowArModal] = useState(false)

  // Categories data
  const categories = [
    {
      id: "temples",
      title: "Temples",
      description: "Ancient temples with stunning architecture",
      image: "/images/categories/temples.jpg",
    },
    {
      id: "waterfalls",
      title: "Waterfalls",
      description: "Breathtaking waterfalls amidst lush greenery",
      image: "/images/categories/waterfalls.jpg",
    },
    {
      id: "forts",
      title: "Forts",
      description: "Historic forts with rich cultural heritage",
      image: "/images/categories/forts.jpg",
    },
    {
      id: "mountains",
      title: "Mountains",
      description: "Majestic mountains and scenic landscapes",
      image: "/images/categories/mountains.jpg",
    },
    {
      id: "food",
      title: "Food",
      description: "Delicious local cuisine and delicacies",
      image: "/images/categories/food.jpg",
    },
    {
      id: "dance-art",
      title: "Dance & Art Forms",
      description: "Traditional dance and art forms",
      image: "/images/categories/dance-art.jpg",
    },
    // {
    //   id: "clothes",
    //   title: "Clothes",
    //   description: "Traditional attire and textiles",
    //   image: "/images/categories/clothes.jpg",
    // },
  ]

  useEffect(() => {
    // Reset animations when component mounts or when navigating back to this page
    const resetAnimations = () => {
      // Clear any existing animations
      gsap.killTweensOf(textRef.current);
      
      // Reset text overlay
      gsap.set(textRef.current, { opacity: 0, y: 50 });
      
      // Animate the text overlay when the page loads
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
      });
    };

    resetAnimations();

    // Create header animation on scroll
    if (textRef.current && headerRef.current) {
      // Initial state of the header
      gsap.set(headerRef.current, { 
        y: -100, 
        opacity: 0 
      });

      // Create scroll animation for the header - removed scrub for better control
      ScrollTrigger.create({
        trigger: "main",
        start: "top top",
        end: "10% top",
        onEnter: () => {
          gsap.to(headerRef.current, { y: 0, opacity: 1, duration: 0.5 });
          gsap.to(textRef.current, { opacity: 0, y: 100, duration: 0.5 });
        },
        onLeaveBack: () => {
          gsap.to(headerRef.current, { y: -100, opacity: 0, duration: 0.5 });
          gsap.to(textRef.current, { opacity: 1, y: 0, duration: 0.5 });
        }
      });
    }

    // Create a 3D scroll effect for the cards
    if (cardsRef.current) {
      // Set initial state for cards
      gsap.set(".card-item", {
        opacity: 0,
        y: 50,
        rotationX: 15,
        transformPerspective: 800,
      });

      // Create scroll animations for each card
      gsap.to(".card-item", {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 0.5,
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power1.out",
      });

      // Create a parallax effect for the section background
      gsap.to(".explore-bg", {
        scrollTrigger: {
          trigger: exploreRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        y: "20%",
        ease: "none",
      });
    }
    
    // Cleanup function to kill animations when component unmounts
    return () => {
      gsap.killTweensOf(textRef.current);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Fixed Header that appears on scroll */}
      <header 
        ref={headerRef} 
        className="fixed top-0 left-0 w-full bg-amber-900/80 backdrop-blur-md z-50 py-5 px-6 flex items-center justify-between shadow-md"
      >
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Karnataka Tourism Logo" 
            width={240}
            height={80}
            className="h-14 w-auto"
            priority
          />
        </div>
        <div className="text-amber-100 font-semibold text-lg">
          Welcome to our Immersive Website
        </div>
      </header>

      {/* Header Section with Video Background */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster="/video-poster.jpg"
        >
          <source src="/videos/bg-main.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Text Overlay with Logo */}
        <div
          ref={textRef}
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-amber-300 drop-shadow-lg">
            WELCOME TO OUR IMMERSIVE SITE
          </h1>
          
          {/* Custom Logo */}
          <div className="mb-12 w-[800px] max-w-[90%] h-auto relative">
            <Image 
              src="/logo.png" 
              alt="Karnataka Tourism Logo" 
              width={800} 
              height={267}
              className="drop-shadow-lg"
              priority
              style={{ objectFit: "contain" }}
              loading="eager"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/trip-planner">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white rounded-full font-josefin shadow-lg transition-all hover:scale-105">
                Plan Your Trip
              </button>
            </Link>

            <button
              onClick={() => setShowArModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white rounded-full font-josefin shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Smartphone size={20} />
              Experience in AR
            </button>
          </div>
        </div>
      </section>

      {/* Explore Karnataka Section with 3D Scroll Effect */}
      <section ref={exploreRef} className="relative w-full py-24 px-4 overflow-hidden mt-16">
        {/* Parallax Background */}
        <div className="explore-bg absolute inset-0 bg-gradient-to-b from-amber-800/20 to-amber-600/20 -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-amber-900 font-josefin">Explore Karnataka</h2>

          {/* 3D Grid Layout - Modified for better visibility */}
          <div 
            ref={cardsRef} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16"
          >
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="card-item"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                }}
              >
                <Link href={`/category/${category.id}`}>
                  <Card className="overflow-hidden h-full border-amber-200 bg-white/90 backdrop-blur-sm hover:shadow-[0_10px_30px_rgba(180,130,10,0.3)] transition-all duration-500 hover:scale-105 group">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-3 py-1 bg-amber-600 text-white text-sm rounded-full font-josefin">
                          Explore
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 bg-gradient-to-r from-amber-50 to-amber-100/80">
                      <h3 className="text-2xl font-bold mb-2 text-amber-900 font-josefin">{category.title}</h3>
                      <p className="text-amber-800">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AR Modal */}
      {showArModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowArModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-amber-900 font-josefin mb-4">Experience Karnataka in AR</h3>

            <div className="flex flex-col items-center mb-6">
              <QrCode size={200} className="text-amber-800 mb-4" />
              <p className="text-center text-sm text-gray-500">Scan this QR code with your phone camera</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg mb-6">
              <h4 className="font-bold text-amber-800 mb-2">How to view in AR:</h4>
              <ol className="list-decimal pl-5 text-amber-900 space-y-2">
                <li>Scan the QR code with your phone camera</li>
                <li>Open the link in your mobile browser</li>
                <li>Allow camera access when prompted</li>
                <li>Point your camera at a flat surface</li>
                <li>Experience Karnataka in 3D!</li>
              </ol>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-bold text-amber-800 mb-2">Recommended Free AR Apps:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <div>
                    <span className="font-semibold">Google AR Core</span>
                    <p className="text-sm text-gray-600">Available on most Android devices</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <div>
                    <span className="font-semibold">Apple AR Kit</span>
                    <p className="text-sm text-gray-600">Built into iOS devices (iPhone/iPad)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <div>
                    <span className="font-semibold">Mozilla WebXR Viewer</span>
                    <p className="text-sm text-gray-600">Free app for iOS and Android</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
