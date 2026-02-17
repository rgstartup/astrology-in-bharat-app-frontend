
/**
 * Utility to get a clean API URL from environment variables.
 * Handles cases where the environment variable might already contain /api/v1
 * or have a trailing slash.
 */

export const getBasePath = (): string => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
    // Remove any trailing /api/v1 (recursive and case-insensitive) and trailing slashes
    return rawUrl.replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "").replace(/\/+$/, "");
};

export const getApiUrl = (): string => {
    return `${getBasePath()}/api/v1`;
};

export const API_BASE_URL = getApiUrl();
