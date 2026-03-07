import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { vehicleIcon, sourceIcon, destinationIcon } from "../../icons/icons";
import DashboardLayout from "../../components/DashboardLayout";

function AdminFleetMap() {

  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {

    async function load() {

      const res = await fetch(
        "http://localhost:5001/api/map/assignments/active",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setAssignments(data);
    }

    load();

    const interval = setInterval(load, 5000); // auto refresh
    return () => clearInterval(interval);

  }, []);

  return (

    <DashboardLayout>

      <div style={{ height: "85vh", width: "100%" }}>

        <MapContainer
          center={[20.5937, 78.9629]} // India center
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {assignments.map((a) => {

            const volunteer = a.currentLocation;
            const donor = a.donation?.location;
            const ngo = a.donation?.acceptedBy?.location;

            if (!volunteer || !donor || !ngo) return null;

            const path = [volunteer, donor, ngo];

            return (
              <div key={a.id}>

                {/* 🚚 Volunteer */}
                <Marker position={volunteer} icon={vehicleIcon}>
                  <Popup>
                    <b>Volunteer</b><br />
                    {a.volunteer?.name}<br />
                    {a.volunteer?.phone}
                  </Popup>
                </Marker>

                {/* 🟢 Donor */}
                <Marker position={donor} icon={sourceIcon}>
                  <Popup>
                    <b>Pickup</b><br />
                    {a.donation?.pickupAddress}
                  </Popup>
                </Marker>

                {/* 🔴 NGO */}
                <Marker position={ngo} icon={destinationIcon}>
                  <Popup>
                    <b>NGO</b><br />
                    {a.donation?.acceptedBy?.organizationName}
                  </Popup>
                </Marker>

                {/* Route */}
                <Polyline positions={path} color="#ff6b6b" weight={4} />

              </div>
            );

          })}

        </MapContainer>

      </div>

    </DashboardLayout>
  );
}

export default AdminFleetMap;