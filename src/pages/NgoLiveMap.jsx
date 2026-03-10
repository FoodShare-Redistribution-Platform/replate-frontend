import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import DashboardLayout from '../components/DashboardLayout';
import { greenIcon, greyIcon, redIcon } from "../icons/mapIcons";
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

// Haversine formula — distance between two lat/lng points in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function NgoLiveMap() {
    const [donors, setDonors] = useState([]);
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

        loadDonors();
    }, []);

    async function loadDonors() {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5001/api/map/donors", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                console.error("API error", res.status);
                return;
            }

            const data = await res.json();

            // Geocode donors that don't have stored coordinates
            const resolved = [];
            for (const d of data) {
                if (d.location?.lat && d.location?.lng) {
                    resolved.push(d);
                } else if (d.address || d.city) {
                    const coords = await geocodeAddress(d.address || "", d.city || "", d.pincode || "");
                    if (coords) {
                        resolved.push({ ...d, location: coords });
                    }
                }
            }

            setDonors(resolved);
        } catch (err) {
            console.error("Failed to load donors:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="live-map-loading">
                    <div className="spinner"></div>
                    <p>Loading donor locations...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="live-map-page">
                <div className="live-map-header">
                    <h2>🗺️ Donor Live Map</h2>
                    <div className="live-map-legend">
                        <div className="legend-item">
                            <span className="legend-dot red"></span>
                            You
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot green"></span>
                            Online (Has Donation)
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot grey"></span>
                            Offline (No Donation)
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

                        {donors.map((d) => {
                            if (!d.location?.lat || !d.location?.lng) return null;

                            const distance =
                                selfLocation
                                    ? getDistanceKm(selfLocation.lat, selfLocation.lng, d.location.lat, d.location.lng).toFixed(1)
                                    : null;

                            return (
                                <Marker
                                    key={d.id}
                                    position={[d.location.lat, d.location.lng]}
                                    icon={d.hasDonation ? greenIcon : greyIcon}
                                >
                                    <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={false}>
                                        <div className="tooltip-name">{d.name}</div>
                                        {d.hasDonation ? (
                                            <>
                                                <div className="tooltip-detail">Food Type: <span>{d.foodType}</span></div>
                                                <div className="tooltip-detail">Quantity: <span>{d.quantity}</span></div>
                                            </>
                                        ) : (
                                            <div className="tooltip-detail">No food available</div>
                                        )}
                                        {distance && (
                                            <div className="tooltip-detail">Distance: <span>{distance} km</span></div>
                                        )}
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

export default NgoLiveMap;