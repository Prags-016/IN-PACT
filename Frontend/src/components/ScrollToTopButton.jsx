import React, { useState, useEffect } from "react";

const styles = {
    button: {
        position: "fixed",
        bottom: "28px",
        right: "28px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "#0f2a4a",
        color: "#f4f7fb",
        border: "2px solid #d6a94a",
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 100,
        transition: "opacity 0.2s ease, transform 0.2s ease",
    },
};

/**
 * Floating "back to top" button. Hidden until the user has scrolled down
 * past `showAfter` pixels, then fades in. Mount once, globally — e.g. in
 * App.jsx, right before the closing </div> of the app root — so it's
 * available on every page.
 */
export default function ScrollToTopButton({ showAfter = 400 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > showAfter);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // check initial position in case the page loads already scrolled
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showAfter]);

    if (!visible) return null;

    return (
        <button
            type="button"
            style={styles.button}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            title="Back to top"
        >
            ↑
        </button>
    );
}
