import L from "leaflet";

export const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// 🟢 SOURCE (Donor)
export const sourceIcon = L.divIcon({
  html: `
    <div style="
      background:#2e7d32;
      color:white;
      width:34px;
      height:34px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:bold;
      font-size:16px;
      border:3px solid white;
      box-shadow:0 3px 8px rgba(0,0,0,0.5);
    ">S</div>
  `,
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

// 🔴 DESTINATION (Consumer)
export const destinationIcon = L.divIcon({
  html: `
    <div style="
      background:#d32f2f;
      color:white;
      width:34px;
      height:34px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:bold;
      font-size:16px;
      border:3px solid white;
      box-shadow:0 3px 8px rgba(0,0,0,0.5);
    ">D</div>
  `,
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});
