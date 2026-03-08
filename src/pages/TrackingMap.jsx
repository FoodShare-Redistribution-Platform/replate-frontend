import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import { vehicleIcon, sourceIcon, destinationIcon } from "../icons/icons";
import { useParams } from "react-router-dom";
import "./VolunteerMap.css";

function TrackingMap() {
  const { assignmentId } = useParams();
  const token = localStorage.getItem("token");

  const [volunteerPos, setVolunteerPos] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `http://localhost:5001/api/assignments/${assignmentId}/map`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setStatus(data.status);

      setVolunteerPos(data.volunteerLocation);
      setSource(data.donorLocation);
      setDestination(data.consumerLocation);

      setPath([
        data.volunteerLocation,
        data.donorLocation,
        data.consumerLocation
      ]);
    }

    load();

    const interval = setInterval(load, 5000); // live tracking refresh
    return () => clearInterval(interval);
  }, [assignmentId]);

  if (!volunteerPos || !source || !destination) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="volunteer-map-page">
      <div className="map-card">
        <h2 className="map-title">Live Delivery Tracking</h2>

        <MapContainer center={volunteerPos} zoom={14} className="map-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={volunteerPos} icon={vehicleIcon} />
          <Marker position={source} icon={sourceIcon} />
          <Marker position={destination} icon={destinationIcon} />

          <Polyline positions={path} color="#ff6b6b" />
        </MapContainer>

        <div className="route-info">
          <div className="info-box">
            <span className="label">Status</span>
            <span className="value">{status.replace("_"," ").toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackingMap;