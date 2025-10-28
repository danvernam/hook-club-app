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
    const clientDataSnapshot = await db.collection('clientData').doc('default').get();
    if (clientDataSnapshot.exists) {
      return NextResponse.json(clientDataSnapshot.data());
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    console.error('Error fetching client data:', error);
    return NextResponse.json({ error: 'Failed to fetch client data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const clientData = await request.json();
    
    await db.collection('clientData').doc('default').set({
      ...clientData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client data:', error);
    return NextResponse.json({ error: 'Failed to update client data' }, { status: 500 });
  }
}
