// src/app/api/cart/save/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId, cart } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Note: In production, verify the token server-side using Firebase Admin SDK
    // For now, we trust the userId from the authenticated client
    // Security should be enforced via Firestore rules
    
    await setDoc(doc(db, 'carts', userId), {
      items: cart || [],
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save cart error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save cart' },
      { status: 400 }
    );
  }
}
