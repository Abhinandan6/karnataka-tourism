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
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// Dustbin icons
const icons = {
  Available: new L.Icon({
    iconUrl: "/green-trash.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  "Almost Full": new L.Icon({
    iconUrl: "/yellow-trash.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Full: new L.Icon({
    iconUrl: "/red-trash.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

// User icon
const userIcon = new L.Icon({
  iconUrl: "/location.png", // Place this image inside your /public folder
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 📍 Search bar
const SearchControl = () => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: "Enter location...",
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

function DustbinLocator() {
  const [dustbins, setDustbins] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const fetchDustbins = async () => {
    const querySnapshot = await getDocs(collection(db, "dustbins"));
    const dustbinData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDustbins(dustbinData);
  };

  useEffect(() => {
    fetchDustbins();

    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error fetching user location", error);
        }
      );
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        await addDoc(collection(db, "dustbins"), {
          latitude: lat,
          longitude: lng,
          status: "Available",
        });
        fetchDustbins();
      },
    });
    return null;
  };

  const deleteDustbin = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this dustbin?");
    if (!confirmDelete) return;
    await deleteDoc(doc(db, "dustbins", id));
    fetchDustbins();
  };

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "dustbins", id), {
      status: newStatus,
    });
    fetchDustbins();
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
        <MapClickHandler />

        {/* User Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <b>Your Location</b>
            </Popup>
          </Marker>
        )}

        {/* Dustbin Markers */}
        {dustbins.map((dustbin) => (
          <Marker
            key={dustbin.id}
            position={[dustbin.latitude, dustbin.longitude]}
            icon={icons[dustbin.status] || icons.Available}
          >
            <Popup>
              <div>
                <strong>Dustbin</strong><br />
                Status:
                <select
                  value={dustbin.status}
                  onChange={(e) => updateStatus(dustbin.id, e.target.value)}
                  style={{ marginTop: "5px", width: "100%" }}
                >
                  <option value="Available">Empty</option>
                  <option value="Almost Full">Almost Full</option>
                  <option value="Full">Full</option>
                </select>
                <button
                  onClick={() => deleteDustbin(dustbin.id)}
                  style={{
                    marginTop: "8px",
                    color: "white",
                    backgroundColor: "red",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    width: "100%"
                  }}
                >
                  Delete
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default DustbinLocator;
