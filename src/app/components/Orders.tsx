"use client";
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getOrders, Order } from '../utils/apiClient';

interface OrdersProps {
  open: boolean;
  onClose: () => void;
}

export default function Orders({ open, onClose }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return 'N/A';
    try {
      let dateObj: Date;
      
      // Handle Firestore Timestamp objects (from admin SDK)
      if (date && typeof date === 'object') {
        if (date.toDate && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else if (date._seconds) {
          // Firestore Timestamp with _seconds property (serialized)
          dateObj = new Date(date._seconds * 1000);
        } else if (date.seconds) {
          // Firestore Timestamp with seconds property
          dateObj = new Date(date.seconds * 1000);
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          // Try to parse as ISO string or timestamp
          dateObj = new Date(date);
        }
      } else if (typeof date === 'string') {
        // Handle ISO string dates
        dateObj = new Date(date);
      } else {
        // Handle number timestamps
        dateObj = new Date(date);
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">My Orders</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No orders found.
          </Alert>
        ) : (
          <List>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 2,
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Order #{order.id.slice(0, 8)}
                    </Typography>
                    <Chip 
                      label={order.status || 'Pending'} 
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Order Date:</strong> {formatDate(order.orderDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {order.address}
                      {order.landmark && ` (${order.landmark})`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Phone:</strong> {order.phoneNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Items:
                    </Typography>
                    {order.items?.map((item, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                        • {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Downpayment:</strong> ${order.downpaymentPrice?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      <strong>Total:</strong> ${order.totalPrice?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </ListItem>
                {index < orders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

