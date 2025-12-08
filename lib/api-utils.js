// lib/api-utils.js
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from './firebase';
import { verifyIdToken } from 'firebase-admin/auth';

// For client-side token verification (used in API routes)
export async function verifyTokenClient(token) {
  try {
    if (!token) return null;
    
    // Verify token using Firebase Admin would go here
    // For now, we'll use a simpler approach with client SDK
    // In production, use Firebase Admin SDK on server
    const user = auth.currentUser;
    if (user) {
      const userToken = await user.getIdToken(true);
      if (userToken === token) {
        return {
          uid: user.uid,
          email: user.email,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Get user data from Firestore
export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

