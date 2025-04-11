import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // This is a mock response for demonstration
    // In a real application, you would call an AI service like OpenAI here
    const mockResponse = generateMockResponse(prompt)

    // Add a slight delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({ result: mockResponse })
  } catch (error) {
    console.error("Error generating trip:", error)
    return NextResponse.json({ error: "Failed to generate trip" }, { status: 500 })
  }
}

// Helper function to generate a mock response
function generateMockResponse(prompt: string) {
  const lowercasePrompt = prompt.toLowerCase()

  // Extract location and duration from prompt
  let location = "Karnataka"
  let days = 5

  if (lowercasePrompt.includes("coorg")) location = "Coorg"
  if (lowercasePrompt.includes("hampi")) location = "Hampi"
  if (lowercasePrompt.includes("mysore")) location = "Mysore"
  if (lowercasePrompt.includes("bangalore") || lowercasePrompt.includes("bengaluru")) location = "Bengaluru"

  if (lowercasePrompt.includes("3-day") || lowercasePrompt.includes("3 day")) days = 3
  if (lowercasePrompt.includes("4-day") || lowercasePrompt.includes("4 day")) days = 4
  if (lowercasePrompt.includes("5-day") || lowercasePrompt.includes("5 day")) days = 5
  if (lowercasePrompt.includes("7-day") || lowercasePrompt.includes("7 day")) days = 7

  // Generate itinerary based on location
  let itinerary = ""

  if (location === "Coorg") {
    itinerary = `
      <h3 class="text-xl font-bold text-amber-800 mt-4 mb-2">Your ${days}-Day Coorg Adventure</h3>
      <p class="mb-4">Experience the beauty of the Scotland of India with this personalized itinerary:</p>
      
      <div class="border-l-4 border-amber-500 pl-4 mb-6">
        <h4 class="font-bold text-amber-900">Day 1: Arrival & Relaxation</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Arrive in Madikeri, the capital of Coorg</li>
          <li>Check into your accommodation - we recommend a coffee plantation stay</li>
          <li>Visit Abbey Falls in the evening</li>
          <li>Enjoy a traditional Kodava dinner</li>
        </ul>
        
        <h4 class="font-bold text-amber-900">Day 2: Nature & Wildlife</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Early morning trek to Tadiandamol Peak</li>
          <li>Visit Dubare Elephant Camp</li>
          <li>Afternoon river rafting in the Cauvery River</li>
          <li>Evening coffee plantation tour</li>
        </ul>
        
        <h4 class="font-bold text-amber-900">Day 3: Culture & Heritage</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Visit Raja's Seat for panoramic views</li>
          <li>Explore Madikeri Fort</li>
          <li>Visit the Omkareshwara Temple</li>
          <li>Shop for local spices and coffee</li>
        </ul>
    `

    if (days > 3) {
      itinerary += `
        <h4 class="font-bold text-amber-900">Day 4: Culinary Experiences</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Kodava cuisine cooking class</li>
          <li>Visit to local markets</li>
          <li>Coffee tasting session</li>
          <li>Evening cultural performance</li>
        </ul>
      `
    }

    if (days >= 5) {
      itinerary += `
        <h4 class="font-bold text-amber-900">Day 5: Relaxation & Departure</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Morning yoga session amidst nature</li>
          <li>Visit to Nagarhole National Park</li>
          <li>Last-minute souvenir shopping</li>
          <li>Departure with sweet memories</li>
        </ul>
      `
    }

    itinerary += `</div>`
  } else if (location === "Hampi") {
    itinerary = `
      <h3 class="text-xl font-bold text-amber-800 mt-4 mb-2">Your ${days}-Day Hampi Cultural Tour</h3>
      <p class="mb-4">Explore the ancient ruins of the Vijayanagara Empire with this itinerary:</p>
      
      <div class="border-l-4 border-amber-500 pl-4 mb-6">
        <h4 class="font-bold text-amber-900">Day 1: Arrival & Introduction</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Arrive in Hampi</li>
          <li>Check into your accommodation</li>
          <li>Evening visit to Hemakuta Hill for sunset</li>
          <li>Orientation walk around Hampi Bazaar</li>
        </ul>
        
        <h4 class="font-bold text-amber-900">Day 2: Sacred Center</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Visit Virupaksha Temple</li>
          <li>Explore Krishna Temple and Lakshmi Narasimha</li>
          <li>Afternoon at Underground Shiva Temple</li>
          <li>Evening boat ride across the Tungabhadra River</li>
        </ul>
        
        <h4 class="font-bold text-amber-900">Day 3: Royal Enclosure</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Visit the Royal Enclosure</li>
          <li>Explore Hazara Rama Temple</li>
          <li>See the Queen's Bath and Lotus Mahal</li>
          <li>Evening at Mahanavami Dibba</li>
        </ul>
    `

    itinerary += `</div>`
  } else {
    // Generic Karnataka itinerary
    itinerary = `
      <h3 class="text-xl font-bold text-amber-800 mt-4 mb-2">Your ${days}-Day Karnataka Adventure</h3>
      <p class="mb-4">Experience the diverse beauty of Karnataka with this personalized itinerary:</p>
      
      <div class="border-l-4 border-amber-500 pl-4 mb-6">
        <h4 class="font-bold text-amber-900">Day 1: Bengaluru</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Arrive in Bengaluru, the Garden City</li>
          <li>Visit Lalbagh Botanical Garden</li>
          <li>Explore Cubbon Park</li>
          <li>Evening at MG Road and Commercial Street</li>
        </ul>
        
        <h4 class="font-bold text-amber-900">Day 2: Mysore</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Travel to Mysore</li>
          <li>Visit the magnificent Mysore Palace</li>
          <li>Explore Chamundi Hills</li>
          <li>Evening at Devaraja Market</li>
        </ul>
        
        <h4 class="font-bold text-amber-900">Day 3: Coorg</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Travel to Coorg</li>
          <li>Visit Abbey Falls</li>
          <li>Explore a coffee plantation</li>
          <li>Evening at Raja's Seat</li>
        </ul>
    `

    if (days > 3) {
      itinerary += `
        <h4 class="font-bold text-amber-900">Day 4: Hampi</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Travel to Hampi</li>
          <li>Explore the ancient ruins</li>
          <li>Visit Virupaksha Temple</li>
          <li>Sunset from Hemakuta Hill</li>
        </ul>
      `
    }

    if (days >= 5) {
      itinerary += `
        <h4 class="font-bold text-amber-900">Day 5: Gokarna/Murudeshwar</h4>
        <ul class="list-disc ml-5 mb-4">
          <li>Travel to the coastal region</li>
          <li>Relax at Om Beach in Gokarna</li>
          <li>Visit Murudeshwar Temple</li>
          <li>Enjoy fresh seafood by the beach</li>
        </ul>
      `
    }

    itinerary += `</div>`
  }

  // Add recommendations
  itinerary += `
    <h3 class="text-xl font-bold text-amber-800 mt-6 mb-2">Recommendations</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 class="font-bold text-amber-900 mb-2">Where to Stay</h4>
        <ul class="list-disc ml-5">
          <li>Luxury: Orange County Resort</li>
          <li>Mid-range: Zostel Backpacker Hostel</li>
          <li>Budget: Homestays in local villages</li>
        </ul>
      </div>
      
      <div class="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 class="font-bold text-amber-900 mb-2">What to Eat</h4>
        <ul class="list-disc ml-5">
          <li>Kodava Pork Curry</li>
          <li>Akki Roti</li>
          <li>Coorg Honey</li>
          <li>Filter Coffee</li>
        </ul>
      </div>
    </div>
    
    <p class="text-amber-800 italic">This itinerary is customized based on your request. Feel free to adjust it according to your preferences and travel pace.</p>
  `

  return itinerary
}
