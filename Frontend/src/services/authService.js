import { apiFetch, setToken, clearToken } from "./api";

/**
 * Logs a citizen or admin in with email/password.
 * On success, stores the JWT and returns the user object — matches the shape
 * CitizenLogin.jsx/GovernmentLogin.jsx pass to onLogin().
 */
export async function login(email, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
    });
    setToken(data.token);
    return data.user; // { id, name, email, role }
}

/**
 * Registers a new citizen account. Note: the backend always forces role to
 * "citizen" regardless of what's sent — admin accounts are created via the
 * backend's seed script only, never through this endpoint.
 */
export async function register({ name, email, password, phone, ward }) {
    const data = await apiFetch("/auth/register", {
        method: "POST",
        body: { name, email, password, phone, ward },
    });
    setToken(data.token);
    return data.user;
}

/**
 * Sends a real OTP verification code to the given mobile number.
 */
export async function sendOtp(phone) {
    const data = await apiFetch("/auth/send-otp", {
        method: "POST",
        body: { phone },
    });
    return data; // { success, message, smsNotification }
}

/**
 * Logs in or auto-provisions a citizen via verified Mobile OTP.
 */
export async function mobileOtpLogin(phone, otp) {
    const data = await apiFetch("/auth/mobile-otp", {
        method: "POST",
        body: { phone, otp },
    });
    setToken(data.token);
    return data.user;
}

/** Fetches the currently logged-in user from the stored token. */
export async function getMe() {
    const data = await apiFetch("/auth/me");
    return data.user;
}

export function logout() {
    clearToken();
}