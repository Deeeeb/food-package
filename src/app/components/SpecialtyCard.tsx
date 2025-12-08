"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export interface SpecialtyItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface SpecialtyCardProps {
  item: SpecialtyItem;
  onAddToCart: (item: SpecialtyItem) => void;
}

export default function SpecialtyCard({ item, onAddToCart }: SpecialtyCardProps) {
  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: { xs: '100%', sm: 345 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-8px) scale(1.02)' },
          boxShadow: '0 20px 40px -12px rgba(236, 72, 153, 0.3)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          '& .card-media': {
            transform: { xs: 'none', sm: 'scale(1.05)' },
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <CardMedia
        component="div"
        className="card-media"
        sx={{
          height: { xs: 200, sm: 240 },
          backgroundColor: 'secondary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: item.image 
            ? `url(${item.image})` 
            : 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
          },
        }}
      >
        {!item.image && (
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 800,
              fontSize: { xs: '3rem', sm: '4rem' },
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 1,
            }}
          >
            {item.name.charAt(0)}
          </Typography>
        )}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: { xs: 1.5, sm: 2 }, gap: 1, flexWrap: 'wrap' }}>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              lineHeight: 1.3,
              color: 'text.primary',
              flex: { xs: '1 1 100%', sm: 'none' },
            }}
          >
            {item.name}
          </Typography>
          <Chip 
            label="Specialty" 
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
              color: 'white',
              fontWeight: 600,
              height: { xs: 22, sm: 24 },
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
            }}
          />
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            flexGrow: 1,
            lineHeight: 1.6,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          {item.description}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          mt: 'auto', 
          gap: { xs: 2, sm: 2 } 
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: { xs: 'left', sm: 'left' },
            }}
          >
            ${item.price.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => onAddToCart(item)}
            fullWidth={true}
            sx={{ 
              borderRadius: 12,
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.25, sm: 1 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                boxShadow: '0 6px 20px rgba(236, 72, 153, 0.5)',
                transform: 'translateY(-1px)',
              },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}


