// src/app/api/orders/list/route.ts
import { NextResponse } from 'next/server';
import { adminDB } from '../../../../../lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const ordersSnapshot = await adminDB
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamps to ISO strings
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate ? data.orderDate.toDate().toISOString() : data.orderDate,
        deliveryDate: data.deliveryDate?.toDate ? data.deliveryDate.toDate().toISOString() : data.deliveryDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('List orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list orders' },
      { status: 400 }
    );
  }
}
