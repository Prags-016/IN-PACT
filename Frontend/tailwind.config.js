/**
 * IN-PACT Design System — Tailwind Token Extension
 * -------------------------------------------------
 * Drop this into your existing tailwind.config.js `theme.extend` block
 * (or merge it in if you already have one). Every color/radius/shadow
 * below maps 1:1 to Section 1 of the IN-PACT design spec, so components
 * reference semantic names (bg-surface-canvas) instead of raw hex.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 1.1 — Surface hierarchy
        surface: {
          canvas: "#070B14",   // Root app canvas
          container: "#0F172A", // Card / panel surface
          elevated: "#1E293B",  // Modals / tooltips / elevated surface
        },
        border: {
          subdued: "#1E293B",
          active: "#334155",
        },
        // 1.1 — Brand + AI accents
        brand: {
          DEFAULT: "#3B82F6", // Primary Electric Blue
          hover: "#1E40AF",   // Deep Electric Blue (hover)
        },
        ai: {
          cyan: "#06B6D4",   // AI co-pilot / confidence indicators
          purple: "#8B5CF6", // AI accent / verification
        },
        // 1.1 — Text
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
        },
        // 1.3 — Severity scale
        severity: {
          low: "#10B981",
          medium: "#F59E0B",
          high: "#EF4444",
          critical: "#DC2626",
        },
        // 1.2 — Status palette (raw tokens; badges also use rgba fills, see StatusBadge.jsx)
        status: {
          reported: "#94A3B8",
          verified: "#06B6D4",
          assigned: "#3B82F6",
          inProgress: "#F59E0B",
          resolved: "#10B981",
          citizenPending: "#8B5CF6",
          critical: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"], // ticket IDs, coordinates, timestamps, SLA timers
      },
      borderRadius: {
        card: "12px",  // rounded-xl equivalent, named per spec
        control: "8px", // buttons / inputs
        // pill/badge uses Tailwind's built-in rounded-full (9999px)
      },
      boxShadow: {
        container:
          "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};
