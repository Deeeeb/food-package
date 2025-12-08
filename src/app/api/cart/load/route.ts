// src/app/api/cart/load/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Note: In production, verify the token server-side using Firebase Admin SDK
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    
    if (cartDoc.exists()) {
      return NextResponse.json({
        success: true,
        cart: cartDoc.data().items || [],
      });
    }

    return NextResponse.json({
      success: true,
      cart: [],
    });
  } catch (error: any) {
    console.error('Load cart error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load cart' },
      { status: 400 }
    );
  }
}
