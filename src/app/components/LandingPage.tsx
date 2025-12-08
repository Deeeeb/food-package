"use client";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import FoodCard from './FoodCard';
import SpecialtyCard, { SpecialtyItem } from './SpecialtyCard';
import FoodCustomizationModal, {
  CustomizableFoodItem,
  CustomizedSelection,
} from './FoodCustomizationModal';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import UserNavbar from './UserNavbar';
import { useAuth } from '../contexts/AuthContext';
import { saveCart, loadCart, createOrder, OrderData } from '../utils/apiClient';
import Link from 'next/link';

interface CustomizedCartItem {
  id: string;
  name: string;
  baseItemId: string;
  baseItemName: string;
  selections: CustomizedSelection;
  price: number;
  quantity: number;
  category: 'pack-lunch' | 'food-set';
}

interface SpecialtyCartItem {
  id: string;
  name: string;
  baseItemId: string;
  price: number;
  quantity: number;
  category: 'specialty';
}

type CartItem = CustomizedCartItem | SpecialtyCartItem;

// Sample food data with customization options
const sampleFoods: CustomizableFoodItem[] = [
  {
    id: '1',
    name: 'Classic Pack Lunch',
    description: 'Build your perfect pack lunch by choosing your main dish, side, drink, and dessert.',
    category: 'pack-lunch',
    categories: [
      {
        id: 'main',
        name: 'Main Dish',
        required: true,
        type: 'single',
        options: [
          { id: 'main-1', name: 'Turkey Sandwich', price: 5.99 },
          { id: 'main-2', name: 'Chicken Wrap', price: 6.49 },
          { id: 'main-3', name: 'Veggie Wrap', price: 5.49 },
          { id: 'main-4', name: 'Ham & Cheese Sandwich', price: 5.99 },
        ],
      },
      {
        id: 'side',
        name: 'Side Dish',
        required: true,
        type: 'single',
        options: [
          { id: 'side-1', name: 'Chips', price: 1.99 },
          { id: 'side-2', name: 'French Fries', price: 2.49 },
          { id: 'side-3', name: 'Salad', price: 2.99 },
          { id: 'side-4', name: 'Fruit Cup', price: 2.49 },
        ],
      },
      {
        id: 'drink',
        name: 'Drink',
        required: true,
        type: 'single',
        options: [
          { id: 'drink-1', name: 'Water', price: 0.99 },
          { id: 'drink-2', name: 'Soda', price: 1.99 },
          { id: 'drink-3', name: 'Juice', price: 2.49 },
          { id: 'drink-4', name: 'Iced Tea', price: 1.99 },
        ],
      },
      {
        id: 'dessert',
        name: 'Dessert',
        required: false,
        type: 'single',
        options: [
          { id: 'dessert-1', name: 'Cookie', price: 1.49 },
          { id: 'dessert-2', name: 'Brownie', price: 2.49 },
          { id: 'dessert-3', name: 'Fruit', price: 1.99 },
          { id: 'dessert-4', name: 'No Dessert', price: 0 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Premium Pack Lunch',
    description: 'Gourmet options with premium ingredients. Customize every component to your taste.',
    category: 'pack-lunch',
    categories: [
      {
        id: 'main',
        name: 'Main Dish',
        required: true,
        type: 'single',
        options: [
          { id: 'main-1', name: 'Grilled Chicken Sandwich', price: 8.99 },
          { id: 'main-2', name: 'Salmon Wrap', price: 9.99 },
          { id: 'main-3', name: 'Caprese Sandwich', price: 7.99 },
          { id: 'main-4', name: 'Beef & Arugula Wrap', price: 9.49 },
        ],
      },
      {
        id: 'side',
        name: 'Side Dish',
        required: true,
        type: 'single',
        options: [
          { id: 'side-1', name: 'Organic Salad', price: 3.99 },
          { id: 'side-2', name: 'Quinoa Salad', price: 4.49 },
          { id: 'side-3', name: 'Sweet Potato Fries', price: 3.49 },
          { id: 'side-4', name: 'Fresh Fruit Bowl', price: 3.99 },
        ],
      },
      {
        id: 'drink',
        name: 'Drink',
        required: true,
        type: 'single',
        options: [
          { id: 'drink-1', name: 'Sparkling Water', price: 1.99 },
          { id: 'drink-2', name: 'Premium Juice', price: 3.49 },
          { id: 'drink-3', name: 'Kombucha', price: 4.99 },
          { id: 'drink-4', name: 'Craft Soda', price: 2.99 },
        ],
      },
      {
        id: 'extras',
        name: 'Extras',
        required: false,
        type: 'multiple',
        options: [
          { id: 'extra-1', name: 'Artisanal Cookie', price: 2.99 },
          { id: 'extra-2', name: 'Protein Bar', price: 3.49 },
          { id: 'extra-3', name: 'Nuts Mix', price: 2.99 },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Vegetarian Pack Lunch',
    description: 'Fresh and healthy vegetarian options. Mix and match to create your perfect meal.',
    category: 'pack-lunch',
    categories: [
      {
        id: 'main',
        name: 'Main Dish',
        required: true,
        type: 'single',
        options: [
          { id: 'main-1', name: 'Hummus Wrap', price: 6.99 },
          { id: 'main-2', name: 'Veggie Sandwich', price: 6.49 },
          { id: 'main-3', name: 'Falafel Wrap', price: 7.49 },
          { id: 'main-4', name: 'Avocado Toast', price: 7.99 },
        ],
      },
      {
        id: 'side',
        name: 'Side Dish',
        required: true,
        type: 'single',
        options: [
          { id: 'side-1', name: 'Hummus & Veggies', price: 3.49 },
          { id: 'side-2', name: 'Mixed Nuts', price: 2.99 },
          { id: 'side-3', name: 'Greek Salad', price: 3.99 },
          { id: 'side-4', name: 'Fresh Fruit', price: 2.99 },
        ],
      },
      {
        id: 'drink',
        name: 'Drink',
        required: true,
        type: 'single',
        options: [
          { id: 'drink-1', name: 'Herbal Tea', price: 2.49 },
          { id: 'drink-2', name: 'Fresh Juice', price: 3.49 },
          { id: 'drink-3', name: 'Coconut Water', price: 3.99 },
          { id: 'drink-4', name: 'Sparkling Water', price: 1.99 },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Family Food Set',
    description: 'Complete meal set for 4 people. Choose main courses, sides, salads, and desserts.',
    category: 'food-set',
    categories: [
      {
        id: 'main',
        name: 'Main Course (Select 2)',
        required: true,
        type: 'multiple',
        options: [
          { id: 'main-1', name: 'Grilled Chicken', price: 12.99 },
          { id: 'main-2', name: 'Beef Steak', price: 15.99 },
          { id: 'main-3', name: 'Pasta Primavera', price: 10.99 },
          { id: 'main-4', name: 'Salmon Fillet', price: 14.99 },
          { id: 'main-5', name: 'Vegetable Stir Fry', price: 9.99 },
        ],
      },
      {
        id: 'side',
        name: 'Side Dishes (Select 2)',
        required: true,
        type: 'multiple',
        options: [
          { id: 'side-1', name: 'Mashed Potatoes', price: 4.99 },
          { id: 'side-2', name: 'Rice', price: 3.99 },
          { id: 'side-3', name: 'Roasted Vegetables', price: 5.99 },
          { id: 'side-4', name: 'Mac & Cheese', price: 6.99 },
        ],
      },
      {
        id: 'salad',
        name: 'Salad',
        required: true,
        type: 'single',
        options: [
          { id: 'salad-1', name: 'Caesar Salad', price: 6.99 },
          { id: 'salad-2', name: 'Garden Salad', price: 5.99 },
          { id: 'salad-3', name: 'Greek Salad', price: 7.99 },
        ],
      },
      {
        id: 'dessert',
        name: 'Dessert',
        required: false,
        type: 'single',
        options: [
          { id: 'dessert-1', name: 'Chocolate Cake', price: 8.99 },
          { id: 'dessert-2', name: 'Ice Cream', price: 6.99 },
          { id: 'dessert-3', name: 'Fruit Platter', price: 7.99 },
          { id: 'dessert-4', name: 'No Dessert', price: 0 },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Party Food Set',
    description: 'Large variety platter for gatherings. Select appetizers, mains, and desserts.',
    category: 'food-set',
    categories: [
      {
        id: 'appetizers',
        name: 'Appetizers (Select 3)',
        required: true,
        type: 'multiple',
        options: [
          { id: 'app-1', name: 'Chicken Wings (12 pcs)', price: 12.99 },
          { id: 'app-2', name: 'Spring Rolls (8 pcs)', price: 8.99 },
          { id: 'app-3', name: 'Mozzarella Sticks (10 pcs)', price: 9.99 },
          { id: 'app-4', name: 'Nachos', price: 10.99 },
          { id: 'app-5', name: 'Bruschetta (12 pcs)', price: 11.99 },
        ],
      },
      {
        id: 'mains',
        name: 'Main Dishes (Select 2)',
        required: true,
        type: 'multiple',
        options: [
          { id: 'main-1', name: 'Pizza (Large)', price: 18.99 },
          { id: 'main-2', name: 'Pasta Tray', price: 16.99 },
          { id: 'main-3', name: 'BBQ Platter', price: 24.99 },
          { id: 'main-4', name: 'Taco Bar', price: 19.99 },
        ],
      },
      {
        id: 'desserts',
        name: 'Desserts (Select 2)',
        required: false,
        type: 'multiple',
        options: [
          { id: 'dessert-1', name: 'Cookie Platter', price: 12.99 },
          { id: 'dessert-2', name: 'Brownie Tray', price: 14.99 },
          { id: 'dessert-3', name: 'Fruit Platter', price: 15.99 },
          { id: 'dessert-4', name: 'Cupcake Tray', price: 16.99 },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'Weekend Food Set',
    description: 'Comfort food set for 2-3 people. Perfect for a relaxing weekend meal.',
    category: 'food-set',
    categories: [
      {
        id: 'main',
        name: 'Main Course',
        required: true,
        type: 'single',
        options: [
          { id: 'main-1', name: 'Pasta (Family Size)', price: 14.99 },
          { id: 'main-2', name: 'Pizza (Medium)', price: 16.99 },
          { id: 'main-3', name: 'Chicken Wings (20 pcs)', price: 18.99 },
          { id: 'main-4', name: 'Burger Platter (3 burgers)', price: 17.99 },
        ],
      },
      {
        id: 'side',
        name: 'Sides (Select 2)',
        required: true,
        type: 'multiple',
        options: [
          { id: 'side-1', name: 'French Fries', price: 4.99 },
          { id: 'side-2', name: 'Onion Rings', price: 5.99 },
          { id: 'side-3', name: 'Coleslaw', price: 3.99 },
          { id: 'side-4', name: 'Garlic Bread', price: 4.49 },
        ],
      },
      {
        id: 'drink',
        name: 'Drinks (Select 2)',
        required: true,
        type: 'multiple',
        options: [
          { id: 'drink-1', name: 'Soda (2L)', price: 2.99 },
          { id: 'drink-2', name: 'Juice (1L)', price: 3.99 },
          { id: 'drink-3', name: 'Iced Tea (2L)', price: 3.49 },
        ],
      },
    ],
  },
];

// Specialty items (non-customizable)
const specialtyItems: SpecialtyItem[] = [
  {
    id: 'spec-1',
    name: 'Chef\'s Special Pasta',
    description: 'Our signature pasta dish with house-made sauce, fresh herbs, and premium ingredients. A customer favorite!',
    price: 16.99,
  },
  {
    id: 'spec-2',
    name: 'Gourmet Burger',
    description: 'Premium beef patty with aged cheddar, caramelized onions, crispy bacon, and our secret sauce. Served with fries.',
    price: 14.99,
  },
  {
    id: 'spec-3',
    name: 'BBQ Ribs Platter',
    description: 'Slow-cooked ribs with our signature BBQ sauce, served with coleslaw, cornbread, and baked beans.',
    price: 22.99,
  },
  {
    id: 'spec-4',
    name: 'Seafood Paella',
    description: 'Traditional Spanish paella with fresh seafood, saffron rice, and vegetables. A Mediterranean delight!',
    price: 24.99,
  },
  {
    id: 'spec-5',
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with black truffle, parmesan, and white wine. A luxurious dining experience.',
    price: 19.99,
  },
  {
    id: 'spec-6',
    name: 'Wagyu Steak',
    description: 'Premium wagyu beef, perfectly grilled to your preference, served with roasted vegetables and mashed potatoes.',
    price: 34.99,
  },
];

export default function LandingPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CustomizableFoodItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [checkoutDeliveryAddress, setCheckoutDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (user && !authLoading) {
      loadCart().then((savedCart) => {
        if (savedCart.length > 0) {
          setCart(savedCart);
        }
      });
    }
  }, [user, authLoading]);

  // Save cart to Firestore whenever cart changes and user is logged in
  useEffect(() => {
    if (user && cart.length >= 0 && !authLoading) {
      const timeoutId = setTimeout(() => {
        saveCart(cart);
      }, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [cart, user, authLoading]);

  const handleCustomize = (item: CustomizableFoodItem) => {
    setSelectedItem(item);
    setCustomizationModalOpen(true);
  };

  const handleAddToCart = (
    item: CustomizableFoodItem,
    selections: CustomizedSelection,
    totalPrice: number
  ) => {
    // Generate unique ID for this customized item
    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const cartItem: CustomizedCartItem = {
      id: cartItemId,
      name: `${item.name} (Customized)`,
      baseItemId: item.id,
      baseItemName: item.name,
      selections,
      price: totalPrice,
      quantity: 1,
      category: item.category,
    };

    setCart((prevCart) => [...prevCart, cartItem]);
  };

  const handleAddSpecialtyToCart = (item: SpecialtyItem) => {
    setCart((prevCart) => {
      // Check if this exact specialty item already exists in cart
      const existingItem = prevCart.find(
        (cartItem) => cartItem.category === 'specialty' && cartItem.baseItemId === item.id
      );
      
      if (existingItem) {
        // If exists, increase quantity
        return prevCart.map((cartItem) =>
          cartItem.id === existingItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // If new, add to cart
        const cartItem: SpecialtyCartItem = {
          id: `spec-${item.id}-${Date.now()}`,
          name: item.name,
          baseItemId: item.id,
          price: item.price,
          quantity: 1,
          category: 'specialty',
        };
        return [...prevCart, cartItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSelectionSummary = (item: CartItem): string => {
    if (item.category === 'specialty') {
      return ''; // Specialties don't have customizations
    }
    
    const customizedItem = item as CustomizedCartItem;
    const baseItem = sampleFoods.find((f) => f.id === customizedItem.baseItemId);
    if (!baseItem) return '';

    const summary: string[] = [];
    baseItem.categories.forEach((category) => {
      const selected = customizedItem.selections[category.id] || [];
      if (selected.length > 0) {
        selected.forEach((optionId) => {
          const option = category.options.find((opt) => opt.id === optionId);
          if (option) {
            summary.push(option.name);
          }
        });
      }
    });
    return summary.join(', ');
  };

  const packLunches = sampleFoods.filter((item) => item.category === 'pack-lunch');
  const foodSets = sampleFoods.filter((item) => item.category === 'food-set');

  const handleCheckout = () => {
    if (!user) {
      setCartOpen(false);
      setAuthModalOpen(true);
      return;
    }
    
    if (!userData?.address || !userData?.phoneNumber) {
      alert('Please complete your profile with address and phone number before checkout.');
      setCartOpen(false);
      setUserProfileOpen(true);
      return;
    }
    
    setCartOpen(false);
    setCheckoutModalOpen(true);
    // Set default delivery date to 3 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    setDeliveryDate(defaultDate.toISOString().split('T')[0]);
    // Initialize delivery address with user's address
    setCheckoutDeliveryAddress(userData?.address || '');
    // Reset landmark
    setLandmark('');
  };

  const handlePlaceOrder = async () => {
    if (!user || !userData || !deliveryDate) return;

    setOrderProcessing(true);
    
    try {
      const priceBreakdown = cart.map(item => ({
        itemName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      }));

      const orderData: OrderData = {
        userId: user.uid,
        userName: userData.name,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        landmark: landmark.trim() || undefined,
        orderDate: new Date(),
        deliveryDate: new Date(deliveryDate),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          baseItemId: item.baseItemId,
          selections: 'selections' in item ? item.selections : undefined,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        totalPrice: getTotalPrice(),
        priceBreakdown,
      };

      await createOrder(orderData);
      
      // Clear cart after successful order
      setCart([]);
      setCheckoutModalOpen(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
    }}>
      {/* User Navbar - Shows when logged in */}
      {!authLoading && user && <UserNavbar />}
      
      {/* Login Button - Shows when not logged in */}
      {!authLoading && !user && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 16 },
            right: { xs: 12, sm: 16 },
            zIndex: 1000,
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => setAuthModalOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Login
          </Button>
        </Box>
      )}

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
          color: 'white',
          py: 12,
          pt: user ? 20 : 12,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'float 20s linear infinite',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            Delicious Food Delivered
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
            }}
          >
            Customize your pack lunches and food sets. Fast delivery, great taste!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onClick={() => {
              document.getElementById('pack-lunch-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Order Now
          </Button>
        </Container>
      </Box>

      {/* Floating Cart Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
        }}
      >
        <Badge 
          badgeContent={getTotalItems()} 
          sx={{
            '& .MuiBadge-badge': {
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
              fontWeight: 600,
              fontSize: '0.75rem',
            },
          }}
        >
          <IconButton
            onClick={() => setCartOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: 'white',
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-4px) scale(1.05)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </IconButton>
        </Badge>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        {/* Pack Lunch Section */}
        <Box 
          id="pack-lunch-section" 
          sx={{ 
            mb: { xs: 6, sm: 10 },
            position: 'relative',
            px: { xs: 2, sm: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.75rem' },
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pack Lunches
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              textAlign: 'center', 
              color: 'text.secondary',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
            }}
          >
            Customize your perfect pack lunch - choose your main dish, sides, drinks, and more
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {packLunches.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <FoodCard item={item} onCustomize={handleCustomize} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Food Sets Section */}
        <Box 
          id="food-set-section" 
          sx={{ 
            mb: { xs: 6, sm: 10 },
            position: 'relative',
            px: { xs: 2, sm: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.75rem' },
              background: 'linear-gradient(135deg, #ec4899 0%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Food Sets
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              textAlign: 'center', 
              color: 'text.secondary',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
            }}
          >
            Build your perfect meal set - select main courses, sides, and desserts
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {foodSets.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <FoodCard item={item} onCustomize={handleCustomize} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Specialties Section */}
        <Box 
          id="specialties-section" 
          sx={{ 
            mb: { xs: 6, sm: 10 },
            position: 'relative',
            px: { xs: 2, sm: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.75rem' },
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Specialties
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              textAlign: 'center', 
              color: 'text.secondary',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
            }}
          >
            Chef's signature dishes - perfectly crafted, ready to order
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {specialtyItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <SpecialtyCard item={item} onAddToCart={handleAddSpecialtyToCart} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Customization Modal */}
      {selectedItem && (
        <FoodCustomizationModal
          open={customizationModalOpen}
          onClose={() => {
            setCustomizationModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Shopping Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shopping Cart
            </Typography>
            <IconButton onClick={() => setCartOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty
                </Typography>
              </Box>
            ) : (
              <List>
                {cart.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        py: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {item.category === 'specialty' ? item.name : (item as CustomizedCartItem).baseItemName}
                          </Typography>
                          {item.category !== 'specialty' && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {getSelectionSummary(item)}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        ${item.price.toFixed(2)} each
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
          {cart.length > 0 && (
            <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${getTotalPrice().toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ 
                  py: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Checkout Modal */}
      <Dialog open={checkoutModalOpen} onClose={() => setCheckoutModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
            <strong>Phone:</strong> {userData?.phoneNumber || 'Not set'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Delivery Address:</strong> {userData?.address || 'Not set'}
          </Typography>
          <TextField
            label="Landmark"
            type="text"
            fullWidth
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Enter a nearby landmark (optional)"
          />
          <TextField
            label="Delivery Date *"
            type="date"
            fullWidth
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 
              min: (() => {
                const minDate = new Date();
                minDate.setDate(minDate.getDate() + 3);
                return minDate.toISOString().split('T')[0];
              })()
            }}
            sx={{ mt: 2 }}
            required
          />
          <Alert severity="info" icon={false} sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Downpayment (50%):</strong> ${(getTotalPrice() * 0.5).toFixed(2)}
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> ${getTotalPrice().toFixed(2)}
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handlePlaceOrder} 
            variant="contained" 
            disabled={orderProcessing || !deliveryDate}
          >
            {orderProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      {/* User Profile Modal */}
      <UserProfile 
        open={userProfileOpen} 
        onClose={() => setUserProfileOpen(false)} 
      />

      {/* Footer */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          py: 6,
          mt: 10,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.5) 50%, transparent 100%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Food Package
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Delivering fresh, customizable meals with passion and care.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                    Home
                  </Typography>
                </Link>
                <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                    About Us
                  </Typography>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Email: <a href="mailto:info@foodpackage.com" style={{ color: 'white', textDecoration: 'none' }}>info@foodpackage.com</a>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Phone: <a href="tel:+1234567890" style={{ color: 'white', textDecoration: 'none' }}>+1 (234) 567-8900</a>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.6 }}>
            © {new Date().getFullYear()} Food Package. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
