import React, { useState } from "react";
import DustbinLocator from "./components/DustbinLocator";
import HospitalLocator from "./components/HospitalLocator";
import HotelLocator from "./components/HotelLocator";
import RestaurantLocator from "./components/RestaurantLocator";

function App() {
  const [activeComponent, setActiveComponent] = useState("dustbin");

  const renderComponent = () => {
    switch (activeComponent) {
      case "dustbin":
        return <DustbinLocator />;
      case "hospital":
        return <HospitalLocator />;
      case "hotel":
        return <HotelLocator />;
      case "restaurant":
        return <RestaurantLocator />;
      default:
        return <DustbinLocator />;
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center", color: "#743A16" }}>Smart Map Locator</h1>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {["dustbin", "hospital", "hotel", "restaurant"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveComponent(type)}
            style={{
              backgroundColor: "#FEF7DA",
              color: "#743A16",
              border: "2px solid #743A16",
              padding: "10px 20px",
              margin: "5px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#F5D7AD")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#FEF7DA")}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {renderComponent()}
    </div>
  );
  
}

export default App;
