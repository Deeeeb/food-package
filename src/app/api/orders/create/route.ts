// src/app/api/orders/create/route.ts
import { NextResponse } from 'next/server';
import { adminDB } from '../../../../../lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { userId, orderData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { error: 'Order data is required' },
        { status: 400 }
      );
    }

    // Calculate downpayment (50% of total price)
    const totalPrice = orderData.totalPrice || 0;
    const downpaymentPrice = totalPrice * 0.5;

    // Prepare order document with all required fields
    const orderDoc = {
      userId: userId,
      userName: orderData.userName || '',
      phoneNumber: orderData.phoneNumber || '',
      address: orderData.address || '',
      landmark: orderData.landmark || '',
      totalPrice: totalPrice,
      downpaymentPrice: downpaymentPrice,
      orderDate: orderData.orderDate ? new Date(orderData.orderDate) : new Date(),
      deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : new Date(),
      items: orderData.items || [], // All cart/order items
      priceBreakdown: orderData.priceBreakdown || [],
      status: 'pending',
      createdAt: new Date(),
    };

    // Insert document into 'orders' collection
    const orderRef = await adminDB.collection('orders').add(orderDoc);

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}
