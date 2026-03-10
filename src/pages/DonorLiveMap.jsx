import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import DashboardLayout from '../components/DashboardLayout';
import { greenIcon, redIcon } from "../icons/mapIcons";
import "./LiveMap.css";

// Geocode address using Nominatim
async function geocodeAddress(address, city, pincode) {
    try {
        const query = `${address}, ${city}, ${pincode}`;
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        const res2 = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + " " + pincode)}`
        );
        const data2 = await res2.json();
        if (data2 && data2.length > 0) {
            return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) };
        }
        return null;
    } catch (err) {
        console.error("Geocode failed:", err);
        return null;
    }
}

function DonorLiveMap() {
    const [ngos, setNgos] = useState([]);
    const [user, setUser] = useState(null);
    const [selfLocation, setSelfLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Resolve self-location
            if (parsed.location?.lat && parsed.location?.lng) {
                setSelfLocation(parsed.location);
            } else if (parsed.address || parsed.city) {
                geocodeAddress(parsed.address || "", parsed.city || "", parsed.pincode || "").then(
                    (coords) => { if (coords) setSelfLocation(coords); }
                );
            }
        }

        loadNgos();
    }, []);

    async function loadNgos() {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5001/api/map/ngos", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                console.error("API error", res.status);
                return;
            }

            const data = await res.json();

            // Geocode NGOs that don't have stored coordinates
            const resolved = [];
            for (const n of data) {
                if (n.location?.lat && n.location?.lng) {
                    resolved.push(n);
                } else if (n.address || n.city) {
                    const coords = await geocodeAddress(n.address || "", n.city || "", n.pincode || "");
                    if (coords) {
                        resolved.push({ ...n, location: coords });
                    }
                }
            }

            setNgos(resolved);
        } catch (err) {
            console.error("Failed to load NGOs:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="live-map-loading">
                    <div className="spinner"></div>
                    <p>Loading NGO locations...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="live-map-page">
                <div className="live-map-header">
                    <h2>🗺️ NGO Live Map</h2>
                    <div className="live-map-legend">
                        <div className="legend-item">
                            <span className="legend-dot red"></span>
                            You
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot green"></span>
                            NGO Location
                        </div>
                    </div>
                </div>

                <div className="live-map-container">
                    <MapContainer
                        center={selfLocation || [13.0827, 80.2707]}
                        zoom={12}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Red marker — your own location */}
                        {selfLocation && (
                            <Marker position={[selfLocation.lat, selfLocation.lng]} icon={redIcon}>
                                <Tooltip direction="top" offset={[0, -18]} opacity={1} permanent={false}>
                                    <div className="tooltip-name" style={{ color: "#ef4444" }}>📍 You are here!</div>
                                </Tooltip>
                            </Marker>
                        )}

                        {ngos.map((n) => {
                            if (!n.location?.lat || !n.location?.lng) return null;

                            return (
                                <Marker
                                    key={n.id}
                                    position={[n.location.lat, n.location.lng]}
                                    icon={greenIcon}
                                >
                                    <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={false}>
                                        <div className="tooltip-name">{n.name}</div>
                                        <div className="tooltip-detail">Daily Intake: <span>{n.dailyIntake}</span></div>
                                    </Tooltip>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default DonorLiveMap;