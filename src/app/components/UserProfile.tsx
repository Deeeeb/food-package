"use client";
import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import Alert from '@mui/material/Alert';

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

export default function UserProfile({ open, onClose }: UserProfileProps) {
  const { user, userData, updateUserData, refreshUserData } = useAuth();
  const [name, setName] = useState(userData?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  // Fetch fresh user data when modal opens (only once per open)
  useEffect(() => {
    if (open && user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      refreshUserData();
    } else if (!open) {
      // Reset the ref when modal closes
      hasFetchedRef.current = false;
    }
  }, [open, user, refreshUserData]);

  // Populate input fields when userData changes
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhoneNumber(userData.phoneNumber || '');
      setAddress(userData.address || '');
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await updateUserData({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={userData?.email || ''}
          disabled
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Full Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Address"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleSave} variant="contained" disabled={loading} fullWidth>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

