import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import { vehicleIcon, sourceIcon, destinationIcon } from "../icons/icons";
import "./VolunteerMap.css";
import { useParams } from "react-router-dom";

// ✅ Robust Geocoder
async function geocode(address) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await res.json();

  if (!data || !data.length) {
    throw new Error("Geocoding failed for: " + address);
  }

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinates for: " + address);
  }

  return { lat, lng };
}

// ✅ Route Fetcher
async function getRoute(start, end) {
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
  );
  const data = await res.json();

  return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
    lat,
    lng,
  }));
}

function VolunteerMap() {
  const token = localStorage.getItem("token");
  const { assignmentId } = useParams();

  const [volunteerPos, setVolunteerPos] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [index, setIndex] = useState(0);

  const [phase, setPhase] = useState("waiting_start");
  const [showModal, setShowModal] = useState(false);

  // 🔹 Load Map Data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:5001/api/assignments/${assignmentId}/map`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to load map data");
        const data = await res.json();

        const donor = data.donorLocation?.lat
          ? data.donorLocation
          : await geocode(data.donorAddress);

        const consumer = data.consumerLocation?.lat
          ? data.consumerLocation
          : await geocode(data.consumerAddress);

        const volunteer =
          data.status === "in_transit" && data.volunteerLocation?.lat
            ? data.volunteerLocation
            : await geocode(data.volunteerAddress);

        const route = await getRoute(volunteer, donor);

        setVolunteerPos(volunteer);
        setSource(donor);
        setDestination(consumer);
        setPath(route);
      } catch (err) {
        console.error("Map load failed:", err);
      }
    }

    load();
  }, [assignmentId, token]);

  // ✅ Reset animation index on phase change
  useEffect(() => {
    setIndex(0);
  }, [phase]);

  // 🔹 Animation
  useEffect(() => {
    if (!path.length || phase === "waiting_start" || phase === "completed")
      return;

    const interval = setInterval(() => {
      if (index < path.length) {
        setVolunteerPos(path[index]);
        setIndex((i) => i + 1);
      } else {
        clearInterval(interval);

        if (phase === "to_source") {
          setShowModal(true);
          setPhase("waiting_pickup");
        } else if (phase === "to_destination") {
          setShowModal(true);
          setPhase("completed");
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [index, path, phase]);

  function handleModalOk() {
    setShowModal(false);

    if (phase === "waiting_pickup") {
      setPhase("to_destination");
      getRoute(source, destination).then(setPath);
    }
  }

  if (!volunteerPos || !source || !destination) {
    return <p>Loading map...</p>;
  }

  return (
    <div className="volunteer-map-page">
      <div className="map-card">
        <h2 className="map-title">Volunteer Live Navigation</h2>

        <MapContainer center={volunteerPos} zoom={14} className="map-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* ✅ VEHICLE FIRST */}
          <Marker position={volunteerPos} icon={vehicleIcon} />

          <Marker position={source} icon={sourceIcon} />
          <Marker position={destination} icon={destinationIcon} />

          <Polyline
            positions={path}
            pathOptions={{
              color: phase === "to_source" ? "#1abc9c" : "#ff6b6b",
              weight: 5,
            }}
          />
        </MapContainer>

        <div className="route-info">
          <div className="info-box">
            <span className="label">Status</span>
            <span className="value">
              {phase === "to_source"
                ? "Heading to Donor"
                : phase === "to_destination"
                ? "Heading to Consumer"
                : phase === "completed"
                ? "Completed"
                : "Ready to Start"}
            </span>
          </div>

          <div className="info-box">
            <span className="label">Distance</span>
            <span className="value">
              {(path.length * 0.02).toFixed(1)} km
            </span>
          </div>

          <div className="info-box full">
            <span className="label">Directions</span>
            <span className="value">
              {phase === "to_source"
                ? "Proceed to donor location for pickup."
                : phase === "to_destination"
                ? "Deliver food to consumer safely."
                : ""}
            </span>
          </div>
        </div>
      </div>

      {phase === "waiting_start" && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Start Journey</h3>
            <button onClick={() => setPhase("to_source")}>Start</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {phase === "waiting_pickup"
                ? "Reached Donor"
                : "Reached Destination"}
            </h3>
            <button onClick={handleModalOk}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerMap;
