import L from "leaflet";

// ── Green marker (online / has donation / active) ──
export const greenIcon = L.divIcon({
  html: `
    <div style="
      background: #22c55e;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(34,197,94,0.6), 0 0 12px rgba(34,197,94,0.3);
    "></div>
  `,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  tooltipAnchor: [0, -16]
});

// ── Grey marker (offline / no donation) ──
export const greyIcon = L.divIcon({
  html: `
    <div style="
      background: #9ca3af;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  tooltipAnchor: [0, -16]
});

// ── Red marker (self / "You are here") ──
export const redIcon = L.divIcon({
  html: `
    <div style="
      background: #ef4444;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 10px rgba(239,68,68,0.6), 0 0 14px rgba(239,68,68,0.35);
      animation: pulse-red 1.5s ease-in-out infinite;
    "></div>
    <style>
      @keyframes pulse-red {
        0%, 100% { box-shadow: 0 2px 10px rgba(239,68,68,0.6); }
        50% { box-shadow: 0 2px 20px rgba(239,68,68,0.9), 0 0 30px rgba(239,68,68,0.4); }
      }
    </style>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  tooltipAnchor: [0, -18]
});