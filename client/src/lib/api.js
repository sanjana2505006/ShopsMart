const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

function getDefaultApiUrl() {
    if (import.meta.env.DEV) {
        return '';
    }

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
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    let response;

    try {
        response = await fetch(apiUrl(path), {
            ...options,
            signal: options.signal || controller.signal,
            headers: {
                Accept: 'application/json',
                ...(options.headers || {}),
            },
        });
    } catch (error) {
        window.clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Check that the backend is running on port 5001.');
        }

        throw new Error('Unable to reach the SmartShop server.');
    }

    window.clearTimeout(timeoutId);

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
