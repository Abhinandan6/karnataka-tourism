import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import db from "../firebase";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Icons
const hotelIcon = new L.Icon({
  iconUrl: "/hotel-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const userIcon = new L.Icon({
  iconUrl: "/location.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Search Control
const SearchControl = () => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
      searchLabel: "Search place..."
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
};

// 🧭 Map click and dropdown logic
const MapClickHandler = ({ onAdd }) => {
  useMapEvents({
    click: async (e) => {
      const type = prompt("Enter Hotel Type (Budget, 3-Star, 5-Star):");
      if (!type) return;
      onAdd(e.latlng, type);
    }
  });
  return null;
};

export default function HotelLocator() {
  const [hotels, setHotels] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const fetchHotels = async () => {
    const snapshot = await getDocs(collection(db, "hotels"));
    setHotels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchHotels();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const addHotel = async (latlng, type) => {
    await addDoc(collection(db, "hotels"), {
      latitude: latlng.lat,
      longitude: latlng.lng,
      type
    });
    fetchHotels();
  };

  const deleteHotel = async (id) => {
    const confirm = window.confirm("Delete this hotel?");
    if (confirm) {
      await deleteDoc(doc(db, "hotels", id));
      fetchHotels();
    }
  };

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <MapContainer
        center={userLocation || [13.0827, 80.2707]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <SearchControl />
        <MapClickHandler onAdd={addHotel} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.latitude, hotel.longitude]}
            icon={hotelIcon}
          >
            <Popup>
              <strong>Hotel</strong><br />
              Type: {hotel.type}<br />
              <button
                onClick={() => deleteHotel(hotel.id)}
                style={{
                  background: "red", color: "white", border: "none",
                  padding: "5px", marginTop: "5px", width: "100%", borderRadius: "4px"
                }}
              >
                Delete
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
