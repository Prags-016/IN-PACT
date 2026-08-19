import React from "react";
import {
  CircleDot,
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/**
 * IN-PACT Status Badge — Section 1.2 of the design spec
 * ------------------------------------------------------
 * One source of truth for every status pill in the product (report cards,
 * timeline entries, dashboard tables). Colors/icons are pulled straight
 * from the token spec — never hardcode a status color anywhere else.
 *
 * Usage:
 *   <StatusBadge status="in_progress" />
 *   <StatusBadge status="escalated" />
 */

const STATUS_CONFIG = {
  reported: {
    label: "Reported",
    text: "#94A3B8",
    bg: "rgba(148, 163, 184, 0.1)",
    border: "rgba(148, 163, 184, 0.3)",
    Icon: CircleDot,
  },
  verified: {
    label: "Verified",
    text: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.3)",
    Icon: ShieldCheck,
  },
  assigned: {
    label: "Assigned",
    text: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
    Icon: UserCheck,
  },
  in_progress: {
    label: "In Progress",
    text: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    Icon: Clock,
  },
  resolved: {
    label: "Resolved",
    text: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    Icon: CheckCircle2,
  },
  citizen_verification_pending: {
    label: "Verification Pending",
    text: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.3)",
    Icon: UserCheck,
  },
  reopened: {
    label: "Reopened",
    text: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    Icon: AlertTriangle,
  },
  escalated: {
    label: "Escalated",
    text: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    Icon: AlertTriangle,
  },
};

const SEVERITY_CONFIG = {
  low: {
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.2)",
    label: "Low",
  },
  medium: {
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.2)",
    label: "Medium",
  },
  high: {
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.2)",
    label: "High",
  },
  critical: {
    color: "#DC2626",
    bg: "rgba(220, 38, 38, 0.2)",
    label: "Critical",
  },
};

export function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.reported;
  const { label, text, bg, border, Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide ${className}`}
      style={{
        color: text,
        backgroundColor: bg,
        borderColor: border,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <Icon size={13} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export function SeverityDot({ severity, className = "" }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
  return (
    <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ backgroundColor: config.color }}
      />
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${className}`}
        style={{ backgroundColor: config.color }}
      />
    </span>
  );
}

export function MarkerPin({ severity = "critical" }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.critical;
  return (
    <div className="relative flex items-center justify-center group cursor-pointer">
      <div
        className="absolute -inset-2 rounded-full opacity-35 animate-pulse"
        style={{ backgroundColor: config.color }}
      />
      <div
        className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/20 font-bold text-xs shadow-lg transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: config.color, color: "#ffffff" }}
      >
        !
      </div>
    </div>
  );
}

export function Stat({ value, label, valueClass = "text-text-primary" }) {
  return (
    <div className="px-3 first:pl-0 last:pr-0 text-left">
      <div className={`font-mono text-xl font-bold ${valueClass}`}>{value}</div>
      <div className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
        {label}
      </div>
    </div>
  );
}

export default StatusBadge;
