// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { email, password, name, phoneNumber } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate auth object is properly initialized
    if (!auth) {
      console.error('Firebase auth is not initialized');
      return NextResponse.json(
        { error: 'Firebase authentication is not properly configured' },
        { status: 500 }
      );
    }

    // Validate that auth has a valid app
    if (!auth.app) {
      console.error('Firebase auth app is not available');
      return NextResponse.json(
        { error: 'Firebase app is not properly initialized' },
        { status: 500 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName: name });

    // Create user document
    const userData = {
      uid: user.uid,
      email: user.email,
      name: name,
      phoneNumber: phoneNumber || '',
      address: '',
    };
    await setDoc(doc(db, 'users', user.uid), userData);

    // Get the ID token
    const token = await user.getIdToken();

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: name,
      },
      userData,
      token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Provide more specific error messages
    if (error.code === 'auth/configuration-not-found') {
      return NextResponse.json(
        { 
          error: 'Firebase configuration error. Please check your environment variables.',
          details: 'Make sure all NEXT_PUBLIC_FIREBASE_* environment variables are set in .env.local'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 400 }
    );
  }
}

