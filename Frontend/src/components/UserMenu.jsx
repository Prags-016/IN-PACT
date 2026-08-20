import React, { useState, useRef, useEffect } from "react";

// Self-contained inline styles so this drops in without needing any
// changes to index.css / App.css — keeps this component portable.
const styles = {
    wrapper: { position: "relative", display: "inline-block" },
    avatarBtn: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#0f2a4a",
        color: "#f4f7fb",
        border: "2px solid #d6a94a",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
    },
    dropdown: {
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        minWidth: 220,
        background: "#ffffff",
        border: "1px solid #d6d9e0",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        overflow: "hidden",
        zIndex: 50,
    },
    header: {
        padding: "12px 16px",
        borderBottom: "1px solid #eef0f3",
    },
    name: { fontWeight: 700, fontSize: 14, color: "#0f2a4a", display: "block" },
    roleBadge: {
        display: "inline-block",
        marginTop: 4,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.5px",
        color: "#8a6d1f",
        background: "#fbf1d9",
        padding: "2px 8px",
        borderRadius: 10,
    },
    item: {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 16px",
        fontSize: 14,
        color: "#1f2937",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    itemDanger: {
        color: "#b91c1c",
    },
};

/**
 * Circular avatar with a click-to-open dropdown: dashboard shortcut,
 * settings placeholder, logout. Replaces the wider inline user-pill row.
 *
 * Props:
 *  - user: { name, role, avatar? } — avatar is an optional emoji/image URL;
 *          falls back to the user's initials if not provided
 *  - onDashboard: () => void
 *  - onLogout: () => void
 *  - dashboardActive: bool — true if already on the dashboard (adjusts label)
 */
export default function UserMenu({ user, onDashboard, onLogout, dashboardActive = false }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const initials = (user.name || "?")
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div style={styles.wrapper} ref={menuRef}>
            <button
                type="button"
                style={styles.avatarBtn}
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Account menu"
                aria-expanded={open}
            >
                {initials}
            </button>

            {open && (
                <div style={styles.dropdown} role="menu">
                    <div style={styles.header}>
                        <span style={styles.name}>{user.name}</span>
                        <span style={styles.roleBadge}>{user.role === "admin" ? "Gov Officer" : "Citizen"}</span>
                    </div>

                    <button
                        type="button"
                        style={styles.item}
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onDashboard();
                        }}
                    >
                        {dashboardActive ? "Dashboard (current)" : "Go to Dashboard"}
                    </button>

                    <button
                        type="button"
                        style={styles.item}
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            alert("Settings page coming soon.");
                        }}
                    >
                        Settings
                    </button>

                    <button
                        type="button"
                        style={{ ...styles.item, ...styles.itemDanger }}
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
