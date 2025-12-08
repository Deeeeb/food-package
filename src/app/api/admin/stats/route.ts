// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { adminDB } from '../../../../../lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = adminDB.collection('orders');
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.where('createdAt', '>=', start).where('createdAt', '<=', end) as any;
    }

    const ordersSnapshot = await query.get();
    const orders = ordersSnapshot.docs.map(doc => doc.data());

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
    const completedOrders = orders.filter((o: any) => o.status === 'completed').length;
    const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length;
    
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + (order.totalPrice || 0);
    }, 0);

    const totalDownpayment = orders.reduce((sum: number, order: any) => {
      return sum + (order.downpaymentPrice || 0);
    }, 0);

    const completedRevenue = orders
      .filter((o: any) => o.status === 'completed')
      .reduce((sum: number, order: any) => {
        return sum + (order.totalPrice || 0);
      }, 0);

    // Calculate daily sales for the last 30 days
    const dailySales: { [key: string]: number } = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    orders.forEach((order: any) => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      if (orderDate >= thirtyDaysAgo) {
        const dateKey = orderDate.toISOString().split('T')[0];
        dailySales[dateKey] = (dailySales[dateKey] || 0) + (order.totalPrice || 0);
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        totalDownpayment,
        completedRevenue,
        dailySales,
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 400 }
    );
  }
}

