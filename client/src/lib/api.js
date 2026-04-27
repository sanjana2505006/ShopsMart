const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

function getDefaultApiUrl() {
    if (typeof window === 'undefined') {
        return 'http://localhost:5001';
    }

    const { hostname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }

    return `${window.location.protocol}//${hostname}:5001`;
}

export const API_BASE_URL = configuredApiUrl || getDefaultApiUrl();

export function apiUrl(path) {
    return `${API_BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
    const response = await fetch(apiUrl(path), {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.headers || {}),
        },
    });

    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();

    let data = null;

    if (rawBody) {
        if (contentType.includes('application/json')) {
            data = JSON.parse(rawBody);
        } else {
            try {
                data = JSON.parse(rawBody);
            } catch {
                data = { message: rawBody };
            }
        }
    }

    return {
        ok: response.ok,
        status: response.status,
        headers: response.headers,
        data,
    };
}
