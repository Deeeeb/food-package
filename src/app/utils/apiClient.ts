// src/app/utils/apiClient.ts
import { auth } from '../../../lib/firebase';

export async function saveCart(cart: any[]) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const response = await fetch('/api/cart/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid, cart }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save cart');
    }
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export async function loadCart(): Promise<any[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const response = await fetch('/api/cart/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.cart || [];
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  
  return [];
}

export interface OrderData {
  userId: string;
  userName: string;
  phoneNumber: string;
  address: string;
  landmark?: string;
  orderDate: Date;
  deliveryDate: Date;
  items: Array<{
    id: string;
    name: string;
    baseItemId: string;
    selections?: any;
    price: number;
    quantity: number;
    category: 'pack-lunch' | 'food-set' | 'specialty';
  }>;
  totalPrice: number;
  priceBreakdown: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export async function createOrder(orderData: OrderData): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.uid, orderData }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create order');
  }

  return data.orderId;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  address: string;
  landmark?: string;
  totalPrice: number;
  downpaymentPrice: number;
  orderDate: any;
  deliveryDate: any;
  items: Array<{
    id: string;
    name: string;
    baseItemId: string;
    selections?: any;
    price: number;
    quantity: number;
    category: 'pack-lunch' | 'food-set' | 'specialty';
  }>;
  priceBreakdown: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  status: string;
  createdAt: any;
}

export async function getOrders(): Promise<Order[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const response = await fetch('/api/orders/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.uid }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch orders');
  }

  return data.orders || [];
}
