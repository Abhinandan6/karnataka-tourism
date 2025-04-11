// src/components/maps/HospitalLocator.jsx

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
  doc
} from "firebase/firestore";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const hospitalIcon = new L.Icon({
  iconUrl: "/hospital-icon.png",
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

const MapClickHandler = ({ onAdd }) => {
  useMapEvents({
    click: async (e) => {
      const type = prompt("Enter Hospital Type (Govt, Private, Clinic):");
      if (!type) return;
      onAdd(e.latlng, type);
    }
  });
  return null;
};

export default function HospitalLocator() {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const fetchHospitals = async () => {
    const snapshot = await getDocs(collection(db, "hospitals"));
    setHospitals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchHospitals();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const addHospital = async (latlng, type) => {
    await addDoc(collection(db, "hospitals"), {
      latitude: latlng.lat,
      longitude: latlng.lng,
      type
    });
    fetchHospitals();
  };

  const deleteHospital = async (id) => {
    const confirm = window.confirm("Delete this hospital?");
    if (confirm) {
      await deleteDoc(doc(db, "hospitals", id));
      fetchHospitals();
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
        <MapClickHandler onAdd={addHospital} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.latitude, hospital.longitude]}
            icon={hospitalIcon}
          >
            <Popup>
              <strong>Hospital</strong><br />
              Type: {hospital.type}<br />
              <button
                onClick={() => deleteHospital(hospital.id)}
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
