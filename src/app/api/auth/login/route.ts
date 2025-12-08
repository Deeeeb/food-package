// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get or create user document
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let userData;
    
    if (userDoc.exists()) {
      userData = userDoc.data();
    } else {
      // Create user document
      userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        phoneNumber: '',
        address: '',
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    }

    // Get the ID token
    const token = await user.getIdToken();

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: userData.name,
      },
      userData,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 400 }
    );
  }
}

