import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const songsSnapshot = await db.collection('songs').get();
    const songs = [];
    songsSnapshot.forEach(doc => {
      songs.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const songData = await request.json();
    const docRef = await db.collection('songs').add({
      ...songData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update the document to include the ID in the song data
    await docRef.update({
      id: docRef.id
    });
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}
