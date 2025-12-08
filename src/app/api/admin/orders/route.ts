// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { adminDB } from '../../../../../lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Optional filter by status

    let query: any = adminDB.collection('orders');
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    query = query.orderBy('createdAt', 'desc');

    const ordersSnapshot = await query.get();

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
    console.error('Admin list orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list orders' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    await adminDB.collection('orders').doc(orderId).update({
      status,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order status' },
      { status: 400 }
    );
  }
}

