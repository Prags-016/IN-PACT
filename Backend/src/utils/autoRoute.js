const { DEPARTMENTS } = require("../config/constants");

// Keyword → department code, checked in this priority order (first match wins).
// This is plain keyword matching, not machine learning — labeled honestly as
// "rule-based routing" wherever it's surfaced, not "AI", to avoid overclaiming.
const KEYWORD_RULES = [
    { code: "PWD", keywords: ["road", "pothole", "street", "footpath", "pavement", "traffic", "signal", "bridge"] },
    { code: "JAL_NIGAM", keywords: ["water", "drain", "pipeline", "sewer", "sewage", "flood", "leak", "drainage"] },
    { code: "NPCL", keywords: ["electric", "power", "transformer", "streetlight", "cable", "voltage", "wire"] },
    { code: "SANITATION", keywords: ["garbage", "waste", "sanitation", "dump", "trash", "cattle", "sewage disposal"] },
];

const VALID_CODES = new Set(DEPARTMENTS.map((d) => d.code));

/**
 * Assigns a department code based on simple keyword matching against the
 * issue's category, title, and description. Falls back to GNIDA_ADMIN
 * (central administration) for anything that doesn't match a specific
 * department — keeps every issue counted in the SLA scorecard rather than
 * stuck at the schema's generic "Auto-Routing" default forever.
 */
function assignDepartment({ category = "", title = "", description = "" }) {
    const haystack = `${category} ${title} ${description}`.toLowerCase();

    for (const rule of KEYWORD_RULES) {
        if (rule.keywords.some((kw) => haystack.includes(kw))) {
            return rule.code;
        }
    }
    return "GNIDA_ADMIN";
}

function isValidDepartmentCode(code) {
    return VALID_CODES.has(code);
}

module.exports = { assignDepartment, isValidDepartmentCode };
