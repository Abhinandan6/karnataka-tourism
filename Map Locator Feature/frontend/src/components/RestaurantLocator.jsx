import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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
  doc,
} from "firebase/firestore";
import { MapClickHandler, SearchControl, userIcon } from "./MapCommon";

// 📍 Restaurant Icon
const restaurantIcon = new L.Icon({
  iconUrl: "/restaurant.png", // Place this in /public folder
  iconSize: [35, 35],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function RestaurantLocator() {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const fetchRestaurants = async () => {
    const querySnapshot = await getDocs(collection(db, "restaurants"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRestaurants(data);
  };

  useEffect(() => {
    fetchRestaurants();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Geolocation error", err)
      );
    }
  }, []);

  const handleAddRestaurant = async (latlng) => {
    const name = prompt("Enter restaurant name:");
    if (!name) return;

    await addDoc(collection(db, "restaurants"), {
      latitude: latlng.lat,
      longitude: latlng.lng,
      name,
    });

    fetchRestaurants();
  };

  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm("Delete this restaurant?");
    if (!confirmDelete) return;
    await deleteDoc(doc(db, "restaurants", id));
    fetchRestaurants();
  };

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [13.0827, 80.2707]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        />
        <SearchControl />
        <MapClickHandler onClick={handleAddRestaurant} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {restaurants.map((res) => (
          <Marker
            key={res.id}
            position={[res.latitude, res.longitude]}
            icon={restaurantIcon}
          >
            <Popup>
              <strong>{res.name}</strong>
              <br />
              <button
                onClick={() => deleteRestaurant(res.id)}
                style={{
                  marginTop: "5px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px",
                  cursor: "pointer",
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

export default RestaurantLocator;
