const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8787';

export async function getServerState() {
  const response = await fetch(`${API_BASE}/api/state`);
  if (!response.ok) throw new Error('Unable to load server state');
  return response.json();
}

export async function saveServerState(state) {
  const response = await fetch(`${API_BASE}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!response.ok) throw new Error('Unable to save server state');
  return response.json();
}

export async function getApiHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) throw new Error('API unavailable');
  return response.json();
}
