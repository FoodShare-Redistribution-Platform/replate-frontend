import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { vehicleIcon, sourceIcon, destinationIcon } from "../../icons/icons";
import DashboardLayout from "../../components/DashboardLayout";


// Convert address → coordinates
async function geocode(address) {
  if (!address) return null;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    const data = await res.json();

    if (!data || !data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (err) {
    console.error("Geocode failed:", err);
    return null;
  }
}

function AdminFleetMap() {

  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);





  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }


    async function load() {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/map/assignments/active`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          setAssignments([]);
          return;
        }

        const data = await res.json();

        // Convert addresses → coordinates
        const enriched = await Promise.all(
          data.map(async (a) => {

            const donorAddress = a.donation?.pickupAddress;
            const ngoAddress = a.donation?.acceptedBy?.address;

            const donorCoords = a.donation?.location?.lat
              ? a.donation.location
              : await geocode(donorAddress);

            const ngoCoords = a.donation?.acceptedBy?.location?.lat
              ? a.donation.acceptedBy.location
              : await geocode(ngoAddress);

            return {
              ...a,
              donorCoords,
              ngoCoords
            };

          })
        );

        setAssignments(enriched);

      } catch (err) {
        console.error("Map load error:", err);
      }
    }

    load();


    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);



  }, [token]);

  return (
    <DashboardLayout user={user}>

      <div className="pickups-container">

        <div className="pickups-header">
          <h1>Admin Fleet Map</h1>
          <p>Monitor all active deliveries in real-time</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>

          {/* MAP */}
          <div style={{ height: "80vh" }}>

            <MapContainer
              center={[13.0827, 80.2707]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >

              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {assignments.map((a) => {

                const donor = a.donorCoords;
                const ngo = a.ngoCoords;

                if (!donor || !ngo) return null;

                let volunteer = a.currentLocation?.lat ? a.currentLocation : donor;

                const path = [
                  [volunteer.lat, volunteer.lng],
                  [donor.lat, donor.lng],
                  [ngo.lat, ngo.lng]
                ];

                return (

                  <>

                    <Marker position={[volunteer.lat, volunteer.lng]} icon={vehicleIcon}>
                      <Popup>
                        <b>Volunteer</b><br />
                        {a.volunteer?.name}
                      </Popup>
                    </Marker>

                    <Marker position={[donor.lat, donor.lng]} icon={sourceIcon}>
                      <Popup>
                        <b>Pickup</b><br />
                        {a.donation?.pickupAddress}
                      </Popup>
                    </Marker>

                    <Marker position={[ngo.lat, ngo.lng]} icon={destinationIcon}>
                      <Popup>
                        <b>NGO</b><br />
                        {a.donation?.acceptedBy?.name}
                      </Popup>
                    </Marker>

                    <Polyline positions={path} color="#ff6b6b" weight={4} />

                  </>

                );

              })}

            </MapContainer>

          </div>


          {/* DELIVERY CARDS */}
          <div style={{ overflowY: "auto", maxHeight: "80vh" }}>

            {assignments.map(a => (
              <div key={a.id} className="pickup-card">

                <div className="pickup-info">

                  <h4>{a.donation?.foodName}</h4>

                  <div className="pickup-route">
                    <span>🟢 Pickup: {a.donation?.pickupAddress}</span>
                    <span>🔴 NGO: {a.donation?.acceptedBy?.name}</span>
                    <span>🚚 Volunteer: {a.volunteer?.name}</span>
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <span className={`status-badge ${a.status}`}>
                      {a.status?.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminFleetMap;