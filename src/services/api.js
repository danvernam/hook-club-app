const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

class ApiService {
  // Songs API
  async getSongs() {
    const response = await fetch(`${API_BASE}/api/songs`);
    if (!response.ok) throw new Error('Failed to fetch songs');
    return response.json();
  }

  async getSong(id) {
    const response = await fetch(`${API_BASE}/api/songs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch song');
    return response.json();
  }

  async updateSong(id, songData) {
    const response = await fetch(`${API_BASE}/api/songs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData)
    });
    if (!response.ok) throw new Error('Failed to update song');
    return response.json();
  }

  async createSong(songData) {
    const response = await fetch(`${API_BASE}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData)
    });
    if (!response.ok) throw new Error('Failed to create song');
    return response.json();
  }

  async deleteSong(id) {
    const response = await fetch(`${API_BASE}/api/songs/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete song');
    return response.json();
  }

  // Client Data API
  async getClientData(eventId = 'default') {
    const response = await fetch(`${API_BASE}/api/client-data/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch client data');
    return response.json();
  }

  async updateClientData(eventId, clientData) {
    const response = await fetch(`${API_BASE}/api/client-data/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    if (!response.ok) throw new Error('Failed to update client data');
    return response.json();
  }
}

export default new ApiService();
