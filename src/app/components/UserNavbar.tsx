"use client";
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Divider from '@mui/material/Divider';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import Orders from './Orders';

interface UserNavbarProps {
  onEditProfile?: () => void;
}

export default function UserNavbar({ onEditProfile }: UserNavbarProps) {
  const { user, userData, signOut, loading, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setProfileOpen(true);
    handleClose();
    if (onEditProfile) {
      onEditProfile();
    }
  };

  const handleOrders = () => {
    setOrdersOpen(true);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  // Prioritize name from userData, fallback to email only if name is not available
  // This ensures consistency between login and refresh scenarios
  // If userData is loaded and has a name, use it; otherwise fallback to email
  const displayName = (userData?.name && userData.name.trim())
    ? userData.name 
    : user.email || 'User';

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            Food Package
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500,
              }}
            >
              Welcome, {displayName}
            </Typography>
            
            <IconButton
              onClick={handleClick}
              sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleEditProfile} sx={{ py: 1.5 }}>
          <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Edit Profile
        </MenuItem>
        {!isAdmin && (
          <MenuItem onClick={handleOrders} sx={{ py: 1.5 }}>
            <ReceiptIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Orders
          </MenuItem>
        )}
        <Divider />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            py: 1.5,
            color: 'error.main',
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>

      <UserProfile 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)} 
      />

      <Orders 
        open={ordersOpen} 
        onClose={() => setOrdersOpen(false)} 
      />
    </>
  );
}

