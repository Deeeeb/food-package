"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export default function AuthModal({ open, onClose, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const { signIn, signUp, userData, isAdmin } = useAuth();
  const router = useRouter();

  // Redirect admin after login
  useEffect(() => {
    if (justLoggedIn && userData && isAdmin && !open) {
      router.push('/admin');
      setJustLoggedIn(false);
    }
  }, [justLoggedIn, userData, isAdmin, open, router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'login' | 'signup') => {
    setTab(newValue);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setPhoneNumber('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        setJustLoggedIn(true);
        setSnackbar({
          open: true,
          message: 'Login successful! Welcome back.',
          severity: 'success',
        });
        setTimeout(() => {
          onClose();
          setEmail('');
          setPassword('');
        }, 1000);
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, name, phoneNumber);
        setSnackbar({
          open: true,
          message: 'Signup successful! Welcome to Food Package.',
          severity: 'success',
        });
        setTimeout(() => {
          onClose();
          setEmail('');
          setPassword('');
          setName('');
          setPhoneNumber('');
        }, 1000);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Authentication</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="auth tabs">
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {tab === 'signup' && (
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          )}
          
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          {tab === 'signup' && (
            <TextField
              margin="dense"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              sx={{ mb: 2 }}
            />
          )}
          
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputProps={{ minLength: 6 }}
            helperText={tab === 'signup' ? 'Minimum 6 characters' : ''}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Processing...' : tab === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </DialogActions>
      </form>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

