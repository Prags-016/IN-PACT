import { apiFetch } from "./api";


export async function getMyIssues() {
    const data = await apiFetch("/issues?mine=true");
    return data.issues;
}

/**
 * Fetches all public issues, optionally filtered.
 * @param {object} filters 
 */
export async function getIssues(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const data = await apiFetch(`/issues${params ? `?${params}` : ""}`);
    return data.issues;
}

export async function getIssueById(id) {
    const data = await apiFetch(`/issues/${id}`);
    return data.issue;
}

/**
 * Files a new grievance. Matches the backend's required fields.
 * @param {object} payload - { title, description, category, severity, location: { address, ward, lat, lng }, imageUrl }
 */
export async function createIssue(payload) {
    const data = await apiFetch("/issues", { method: "POST", body: payload });
    return data.issue;
}

/** Toggles the logged-in user's upvote on an issue. Returns { upvotes, hasUpvoted }. */
export async function toggleUpvote(id) {
    return apiFetch(`/issues/${id}/upvote`, { method: "POST" });
}


export async function getStats(ward) {
    const data = await apiFetch(`/issues/stats${ward ? `?ward=${encodeURIComponent(ward)}` : ""}`);
    return data.stats;
}

