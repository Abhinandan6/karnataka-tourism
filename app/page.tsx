"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
  
  // Add these state variables for the Temple AI section
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Temple AI Feature Section Component
  const TempleFeaturedSection = () => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedImage = e.target.files[0]
        setImage(selectedImage)
        setPreview(URL.createObjectURL(selectedImage))
        setResult(null)
        setError(null)
      }
    }

    const handleSubmit = async () => {
      if (!image) {
        setError('Please select an image first')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('usePredefined', 'true')
        
        const response = await fetch('/api/temple-info', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to process image')
        }

        const data = await response.json()
        setResult(data)
      } catch (err) {
        console.error('Error details:', err)
        setError('Error processing image. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    return (
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-amber-800 font-josefin mb-4">Identify Temple Architecture</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              Upload a photo of any Karnataka temple and our AI will identify its dynasty, era, and architectural style.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="border-amber-200 shadow-lg">
              <CardHeader className="bg-amber-100 border-b border-amber-200">
                <CardTitle className="text-amber-800 font-josefin text-xl">Temple AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload a temple image to get AI-generated information
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handleSubmit} 
                        disabled={!image || loading}
                        className="w-full bg-amber-600 hover:bg-amber-700 mt-4"
                      >
                        {loading ? 'Analyzing...' : 'Analyze Temple Image'}
                      </Button>
                      
                      {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {preview ? (
                        <div className="border border-amber-200 rounded-md overflow-hidden h-48 flex items-center justify-center">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="border border-dashed border-amber-200 rounded-md h-48 flex items-center justify-center bg-amber-50">
                          <p className="text-amber-400 text-center px-4">
                            Temple image preview will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result && (
                    <div className="mt-6 space-y-4">
                      <Separator className="bg-amber-200" />
                      <div>
                        <h3 className="font-medium text-amber-800">Description:</h3>
                        <p className="text-gray-700">{result.caption}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-amber-800">Dynasty:</h3>
                          <p className="text-gray-700">{result.dynasty}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800">Era:</h3>
                          <p className="text-gray-700">{result.era}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800">Location:</h3>
                          <p className="text-gray-700">{result.location}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800">Style:</h3>
                          <p className="text-gray-700">{result.style}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mt-4">
                    <Link href="/temple-classifier" className="text-amber-600 hover:text-amber-800 text-sm">
                      Try our full Temple Classifier tool →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

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

      {/* Remove this line - it's causing the duplicate */}
      {/* <TempleFeaturedSection /> */}

      {/* Keep only this improved Temple AI Feature Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-amber-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-800 font-josefin mb-4">Discover Temple Architecture</h2>
            <p className="text-amber-700 max-w-2xl mx-auto text-lg">
              Upload a photo of any Karnataka temple and our AI will identify its dynasty, era, and architectural style.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200 py-6">
                <CardTitle className="text-amber-800 font-josefin text-2xl flex items-center">
                  <span className="bg-amber-600 text-white p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </span>
                  Temple AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                          </svg>
                          Upload Temple Image
                        </h3>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const selectedImage = e.target.files[0];
                              setImage(selectedImage);
                              setPreview(URL.createObjectURL(selectedImage));
                              setResult(null);
                              setError(null);
                            }
                          }} 
                          className="cursor-pointer bg-white border-amber-300 focus:ring-amber-500"
                        />
                        <p className="text-xs text-amber-700/70 mt-2">
                          Supported formats: JPG, PNG, WEBP (Max: 5MB)
                        </p>
                      </div>
                      
                      <Button 
                        onClick={async () => {
                          if (!image) {
                            setError('Please select an image first');
                            return;
                          }
                          
                          setLoading(true);
                          setError(null);
                          
                          try {
                            const formData = new FormData();
                            formData.append('image', image);
                            formData.append('usePredefined', 'true');
                            
                            const response = await fetch('/api/temple-info', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to process image');
                            }
                            
                            const data = await response.json();
                            setResult(data);
                          } catch (err) {
                            console.error('Error details:', err);
                            setError('Error processing image. Please try again.');
                          } finally {
                            setLoading(false);
                          }
                        }} 
                        disabled={!image || loading}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-6 rounded-md font-medium text-lg shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Temple...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="16"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            Analyze Temple Architecture
                          </span>
                        )}
                      </Button>
                      
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                          {error}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {preview ? (
                        <div className="border border-amber-200 rounded-lg overflow-hidden h-64 flex items-center justify-center bg-white shadow-inner">
                          <img 
                            src={preview} 
                            alt="Temple Preview" 
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-amber-200 rounded-lg h-64 flex flex-col items-center justify-center bg-amber-50/50 text-center px-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300 mb-3">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                          <p className="text-amber-600 font-medium">
                            Temple image preview will appear here
                          </p>
                          <p className="text-amber-500/70 text-sm mt-2">
                            Upload a clear image of a temple for best results
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result && (
                    <div className="mt-8 space-y-6 bg-amber-50/70 p-6 rounded-lg border border-amber-200">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-amber-800 font-josefin">Analysis Results</h3>
                        <Separator className="bg-amber-200 mt-2" />
                      </div>
                      
                      <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100">
                        <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          Description:
                        </h3>
                        <p className="text-gray-700">{result.caption}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100">
                          <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            Dynasty:
                          </h3>
                          <p className="text-gray-700 font-medium">{result.dynasty}</p>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100">
                          <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Era:
                          </h3>
                          <p className="text-gray-700 font-medium">{result.era}</p>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100">
                          <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            Location:
                          </h3>
                          <p className="text-gray-700 font-medium">{result.location}</p>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100">
                          <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Style:
                          </h3>
                          <p className="text-gray-700 font-medium">{result.style}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mt-6">
                    <Link href="/temple-classifier" className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium transition-colors">
                      Try our full Temple Classifier tool
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
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
