import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin with service account key if available
let db;
if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');
  let credential;
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  } else {
    credential = admin.credential.applicationDefault();
  }
  
  admin.initializeApp({
    credential: credential,
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
  });
}

db = admin.firestore();

export async function GET(request, { params }) {
  try {
    const { eventId } = params;
    const clientDataSnapshot = await db.collection('clientData').doc(eventId).get();
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

export async function PUT(request, { params }) {
  try {
    const { eventId } = params;
    const clientData = await request.json();
    
    await db.collection('clientData').doc(eventId).set({
      ...clientData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client data:', error);
    return NextResponse.json({ error: 'Failed to update client data' }, { status: 500 });
  }
}












