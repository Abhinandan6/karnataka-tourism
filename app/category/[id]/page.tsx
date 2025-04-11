"use client"

import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { gsap } from "gsap"

export default function CategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  // Fix the TypeScript error by properly typing the unwrapped params
  const unwrappedParams = use(params as unknown as Promise<{ id: string }>)
  const { id } = unwrappedParams
  
  // Get category data - moved outside of render for better performance
  const categoryData = getCategoryData(id)
  
  useEffect(() => {
    // Set loading state
    setIsLoading(false)
    
    // Optimize animations - only run when not loading
    if (!isLoading) {
      // Use a more efficient animation approach
      const elements = document.querySelectorAll(".category-content")
      
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all" // Clear properties after animation for better performance
        }
      )
    }
  }, [isLoading, id])

  // This would be replaced with actual data in a real application
  function getCategoryData(id: string) {
    const categories: Record<
      string,
      {
        title: string
        description: string
        items: Array<{ name: string; slug: string; description: string; image: string }>
      }
    > = {
      temples: {
        title: "Temples of Karnataka",
        description:
          "Karnataka is home to some of the most magnificent temples in India, showcasing exquisite architecture and rich cultural heritage.",
        items: [
          {
            name: "Virupaksha Temple, Hampi",
            slug: "virupaksha-temple",
            description: "Ancient temple dedicated to Lord Shiva, located in the ruins of Hampi",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Chennakesava Temple, Belur",
            slug: "chennakesava-temple",
            description: "12th-century Hoysala temple known for its intricate carvings and design",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Hoysaleswara Temple, Halebidu",
            slug: "hoysaleswara-temple",
            description: "Twin temple dedicated to Lord Shiva with remarkable stone carvings",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Murudeshwara Temple",
            slug: "murudeshwara-temple",
            description: "Coastal temple with the world's second-tallest Shiva statue also most well constructed",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Udupi Sri Krishna Temple",
            slug: "udupi-krishna-temple",
            description: "Famous temple known for its unique window-based darshan",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
      waterfalls: {
        title: "Waterfalls of Karnataka",
        description:
          "Karnataka boasts some of the most spectacular waterfalls in India, nestled amidst lush green forests and hills.",
        items: [
          {
            name: "Jog Falls",
            slug: "jog-falls",
            description: "Second highest plunge waterfall in India, created by the Sharavathi River",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Abbey Falls, Coorg",
            slug: "abbey-falls",
            description: "Picturesque waterfall surrounded by coffee plantations and spice estates",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Iruppu Falls",
            slug: "iruppu-falls",
            description: "Sacred waterfall in the Brahmagiri Range with mythological significance",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Shivanasamudra Falls",
            slug: "shivanasamudra-falls",
            description: "Twin waterfalls formed by the Kaveri River, with a hydroelectric power station",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Hebbe Falls",
            slug: "hebbe-falls",
            description: "Majestic waterfall in Chikmagalur district, requiring a trek through coffee estates",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
      forts: {
        title: "Forts of Karnataka",
        description:
          "The forts of Karnataka stand as testimony to the rich historical past and architectural brilliance of various dynasties.",
        items: [
          {
            name: "Bangalore Fort",
            slug: "bangalore-fort",
            description: "Historic fort built by Kempe Gowda and later expanded by Hyder Ali",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Chitradurga Fort",
            slug: "chitradurga-fort",
            description: "Massive hill fort known as the 'Stone Fortress' with impressive architecture",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Mirjan Fort",
            slug: "mirjan-fort",
            description: "16th-century fort near Gokarna with laterite stone construction",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Bidar Fort",
            slug: "bidar-fort",
            description: "One of the most formidable forts in the country with Persian architectural influence",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Madhugiri Fort",
            slug: "madhugiri-fort",
            description: "Second largest monolith in Asia with a challenging trek to the top",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
      mountains: {
        title: "Mountains of Karnataka",
        description:
          "Karnataka's diverse landscape includes majestic mountains and hills that offer breathtaking views and trekking opportunities.",
        items: [
          {
            name: "Mullayanagiri",
            slug: "mullayanagiri",
            description: "Highest peak in Karnataka, located in the Western Ghats",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Kudremukh",
            slug: "kudremukh",
            description: "Horse-faced mountain peak with rich biodiversity and trekking trails",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Kumara Parvatha",
            slug: "kumara-parvatha",
            description: "Challenging trek in the Western Ghats with stunning views",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Skandagiri",
            slug: "skandagiri",
            description: "Popular night trekking destination near Bangalore",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Nandi Hills",
            slug: "nandi-hills",
            description: "Ancient hill fortress near Bangalore, popular for sunrise views",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
      food: {
        title: "Food of Karnataka",
        description:
          "Karnataka cuisine is diverse and delicious, with distinct flavors from different regions of the state.",
        items: [
          {
            name: "Mysore Masala Dosa",
            slug: "mysore-masala-dosa",
            description: "Crispy dosa with spicy red chutney and potato filling",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Bisi Bele Bath",
            slug: "bisi-bele-bath",
            description: "Spicy rice dish with lentils, vegetables, and aromatic spices",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Ragi Mudde",
            slug: "ragi-mudde",
            description: "Traditional finger millet balls served with sambar or curry",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Neer Dosa",
            slug: "neer-dosa",
            description: "Soft, thin rice crepes from coastal Karnataka",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Mangalore Fish Curry",
            slug: "mangalore-fish-curry",
            description: "Spicy coconut-based fish curry from the coastal region",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
      "dance-art": {
        title: "Dance & Art Forms of Karnataka",
        description:
          "Karnataka has a rich cultural heritage with various traditional dance and art forms that have been preserved over centuries.",
        items: [
          {
            name: "Yakshagana",
            slug: "yakshagana",
            description: "Traditional theater form combining dance, music, and dialogue",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Dollu Kunitha",
            slug: "dollu-kunitha",
            description: "Powerful drum dance performed with large drums hung around the neck",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Kamsale",
            slug: "kamsale",
            description: "Religious folk art dedicated to Lord Mahadeshwara",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Veeragase",
            slug: "veeragase",
            description: "Vigorous dance form dedicated to Lord Veerabhadra",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Bharatanatyam",
            slug: "bharatanatyam",
            description: "Classical dance form with strong roots in Karnataka",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
      clothes: {
        title: "Traditional Clothes of Karnataka",
        description: "Karnataka's traditional attire reflects the state's rich cultural heritage and craftsmanship.",
        items: [
          {
            name: "Ilkal Saree",
            slug: "ilkal-saree",
            description: "Traditional saree with distinctive red border and geometric patterns",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Mysore Silk",
            slug: "mysore-silk",
            description: "Luxurious silk sarees known for their gold zari work",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Khun Fabric",
            slug: "khun-fabric",
            description: "Handloom fabric traditionally used for blouses and now for contemporary clothing",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Kasuti Embroidery",
            slug: "kasuti-embroidery",
            description: "Intricate handwork embroidery traditional to North Karnataka",
            image: "/placeholder.svg?height=300&width=500",
          },
          {
            name: "Lambani Crafts",
            slug: "lambani-crafts",
            description: "Colorful mirror and thread embroidery by the Lambani tribe",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      },
    }

    return (
      categories[id] || {
        title: "Category Not Found",
        description: "The requested category does not exist.",
        items: [],
      }
    )
  }

  // Show a simple loading state
  if (isLoading) {
    return (
      <main className="min-h-screen py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-amber-800 text-xl">Loading...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-8 text-amber-800 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-josefin">Back to Home</span>
        </button>

        <div className="category-content">
          <h1 className="text-4xl font-bold mb-4 text-amber-900 font-josefin">{categoryData.title}</h1>
          <p className="text-xl text-amber-800 mb-8">{categoryData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {categoryData.items.map((item, index) => (
            <Link href={`/place/${id}/${item.slug}`} key={index} prefetch={true}>
              <div className="category-content bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white font-josefin drop-shadow-md">
                    {item.name}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-amber-800">{item.description}</p>
                  <p className="mt-3 text-amber-600 font-medium group-hover:text-amber-800 transition-colors flex items-center">
                    Explore more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
