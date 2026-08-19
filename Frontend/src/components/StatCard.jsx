import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  variant = "default", // default | warning | critical | success | purple
  onClick
}) {
  return (
    <div 
      className={`stat-card stat-card-${variant} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>

      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
        {trend && (
          <div className={`stat-trend ${trendPositive ? "positive" : "negative"}`}>
            <span>{trendPositive ? "↑" : "↓"}</span> {trend}
          </div>
        )}
      </div>

      {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
    </div>
  );
}
