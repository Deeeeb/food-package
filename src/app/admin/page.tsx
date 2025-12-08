"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useAuth } from '../contexts/AuthContext';
import UserNavbar from '../components/UserNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Order {
  id: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  address: string;
  landmark?: string;
  totalPrice: number;
  downpaymentPrice: number;
  orderDate: string;
  deliveryDate: string;
  items: any[];
  status: string;
  createdAt: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalDownpayment: number;
  completedRevenue: number;
  dailySales: { [key: string]: number };
}

type TabValue = 'dashboard' | 'orders' | 'sales' | 'calendar';

export default function AdminPage() {
  const { user, userData, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<TabValue>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('pending');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/');
        return;
      }
      loadData();
    }
  }, [user, isAdmin, authLoading, orderStatusFilter, dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load orders
      const ordersUrl = orderStatusFilter === 'all' 
        ? '/api/admin/orders'
        : `/api/admin/orders?status=${orderStatusFilter}`;
      const ordersResponse = await fetch(ordersUrl);
      const ordersData = await ordersResponse.json();
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }

      // Load stats
      const statsUrl = dateRange.start && dateRange.end
        ? `/api/admin/stats?startDate=${dateRange.start}&endDate=${dateRange.end}`
        : '/api/admin/stats';
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const prepareChartData = () => {
    if (!stats?.dailySales) return [];
    return Object.entries(stats.dailySales)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getCalendarOrders = () => {
    const calendarData: { [key: string]: Order[] } = {};
    orders.forEach(order => {
      const dateKey = order.deliveryDate.split('T')[0];
      if (!calendarData[dateKey]) {
        calendarData[dateKey] = [];
      }
      calendarData[dateKey].push(order);
    });
    return calendarData;
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 4 }}>
      <UserNavbar />
      <Container maxWidth="xl" sx={{ pt: 10 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard" value="dashboard" />
            <Tab icon={<PendingActionsIcon />} iconPosition="start" label="Pending Orders" value="orders" />
            <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Sales" value="sales" />
            <Tab icon={<CalendarMonthIcon />} iconPosition="start" label="Calendar" value="calendar" />
          </Tabs>
        </Paper>

        {/* Dashboard Tab */}
        {currentTab === 'dashboard' && stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Orders
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Revenue
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {formatCurrency(stats.completedRevenue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Daily Sales (Last 30 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Pending Orders Tab */}
        {currentTab === 'orders' && (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={orderStatusFilter}
                  label="Filter by Status"
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Delivery Date</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{order.userName}</TableCell>
                        <TableCell>{order.phoneNumber}</TableCell>
                        <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                        <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {order.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleStatusChange(order.id, 'completed')}
                              >
                                Complete
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Sales Tab */}
        {currentTab === 'sales' && stats && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Date Range Filter
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Start Date</InputLabel>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>End Date</InputLabel>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </FormControl>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Sales Overview
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography color="textSecondary">Total Revenue</Typography>
                      <Typography variant="h5">{formatCurrency(stats.totalRevenue)}</Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Completed Revenue</Typography>
                      <Typography variant="h5" color="success.main">
                        {formatCurrency(stats.completedRevenue)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Total Downpayment</Typography>
                      <Typography variant="h5">{formatCurrency(stats.totalDownpayment)}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Order Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography color="textSecondary">Total Orders</Typography>
                      <Typography variant="h5">{stats.totalOrders}</Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Completed Orders</Typography>
                      <Typography variant="h5" color="success.main">
                        {stats.completedOrders}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Pending Orders</Typography>
                      <Typography variant="h5" color="warning.main">
                        {stats.pendingOrders}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Cancelled Orders</Typography>
                      <Typography variant="h5" color="error.main">
                        {stats.cancelledOrders}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Revenue Chart
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Calendar Tab */}
        {currentTab === 'calendar' && (
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Delivery Calendar
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(getCalendarOrders())
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, dayOrders]) => (
                    <Grid item xs={12} sm={6} md={4} key={date}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {formatDate(date)}
                          </Typography>
                          <Typography color="textSecondary" sx={{ mb: 2 }}>
                            {dayOrders.length} order{dayOrders.length !== 1 ? 's' : ''}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {dayOrders.map((order) => (
                              <Box
                                key={order.id}
                                sx={{
                                  p: 1,
                                  bgcolor: 'grey.100',
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {order.userName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {formatCurrency(order.totalPrice)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </Typography>
                                <Chip
                                  label={order.status}
                                  color={getStatusColor(order.status) as any}
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                {Object.keys(getCalendarOrders()).length === 0 && (
                  <Grid item xs={12}>
                    <Typography align="center" color="textSecondary">
                      No orders scheduled
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}

