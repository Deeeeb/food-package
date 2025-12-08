// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../../lib/firebase';

export async function POST(request: Request) {
  try {
    await signOut(auth);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 400 }
    );
  }
}

