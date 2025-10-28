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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const songData = await request.json();
    
    await db.collection('songs').doc(id).update({
      ...songData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await db.collection('songs').doc(id).delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
