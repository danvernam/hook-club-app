const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
  });
}

const db = admin.firestore();
const server = express();

// Middleware
server.use(cors());
server.use(express.json());

// API Routes
server.get('/api/songs', async (req, res) => {
  try {
    const songsSnapshot = await db.collection('songs').get();
    const songs = [];
    songsSnapshot.forEach(doc => {
      songs.push({ id: doc.id, ...doc.data() });
    });
    res.json({ songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

server.get('/api/songs/:id', async (req, res) => {
  try {
    const songDoc = await db.collection('songs').doc(req.params.id).get();
    if (!songDoc.exists) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json({ id: songDoc.id, ...songDoc.data() });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

server.put('/api/songs/:id', async (req, res) => {
  try {
    const { id, ...songData } = req.body;
    await db.collection('songs').doc(req.params.id).update({
      ...songData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ error: 'Failed to update song' });
  }
});

server.post('/api/songs', async (req, res) => {
  try {
    const songData = req.body;
    const docRef = await db.collection('songs').add({
      ...songData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

server.delete('/api/songs/:id', async (req, res) => {
  try {
    await db.collection('songs').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

// Client Data API Routes
server.get('/api/client-data/:eventId', async (req, res) => {
  try {
    const clientDoc = await db.collection('clientData').doc(req.params.eventId).get();
    if (!clientDoc.exists) {
      return res.json({});
    }
    res.json(clientDoc.data());
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ error: 'Failed to fetch client data' });
  }
});

server.put('/api/client-data/:eventId', async (req, res) => {
  try {
    const clientData = req.body;
    await db.collection('clientData').doc(req.params.eventId).set({
      ...clientData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating client data:', error);
    res.status(500).json({ error: 'Failed to update client data' });
  }
});

// Handle all other requests with Next.js
server.all('*', (req, res) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
