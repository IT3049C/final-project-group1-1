const ROOM_API_BASE = "https://game-room-api.fly.dev/api/rooms";

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        },
    });

    let payload = null;

    try {
        payload = await response.json();
    } catch {
        payload = null;
    }

    if (!response.ok) {
        const message = payload?.error || payload?.message || `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return payload;
}

export async function createRoom(initialState) {
    return requestJson(ROOM_API_BASE, {
        method: "POST",
        body: JSON.stringify({ initialState }),
    });
}

export async function readRoom(roomId) {
    return requestJson(`${ROOM_API_BASE}/${encodeURIComponent(roomId)}`);
}

export async function updateRoom(roomId, gameState) {
    return requestJson(`${ROOM_API_BASE}/${encodeURIComponent(roomId)}`, {
        method: "PUT",
        body: JSON.stringify({ gameState }),
    });
}