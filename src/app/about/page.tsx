"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              sx={{
                color: 'white',
                mb: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Back to Home
            </Button>
          </Link>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '800px' }}>
            Delivering fresh, customizable meals with passion and care
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Our Story Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Who We Are
          </Typography>
          <Card sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Welcome to Food Package! We are a passionate team dedicated to bringing you the freshest,
              most customizable meal options right to your doorstep. Founded with a mission to make
              quality food accessible and convenient, we specialize in creating delicious pack lunches
              and food sets tailored to your preferences.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Our commitment is simple: provide fresh ingredients, offer complete customization, and
              deliver exceptional service. Whether you're looking for a quick pack lunch or a complete
              meal set for your family or event, we've got you covered.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Every dish is prepared with care, and every order is customized to your exact preferences.
              We believe that great food should be accessible, customizable, and delivered with a smile.
            </Typography>
          </Card>
        </Box>

        {/* Contact Information */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Contact Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Email
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Have questions or feedback? Send us an email!
                  </Typography>
                  <Box
                    component="a"
                    href="mailto:info@foodpackage.com"
                    sx={{
                      display: 'inline-block',
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    info@foodpackage.com
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Phone
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Call us for orders or inquiries
                  </Typography>
                  <Box
                    component="a"
                    href="tel:+1234567890"
                    sx={{
                      display: 'inline-block',
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    +1 (234) 567-8900
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Address
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Visit us or check our delivery area
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 'medium' }}>
                    123 Food Street<br />
                    City, State 12345<br />
                    United States
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Business Hours
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    We're here to serve you
                  </Typography>
                  <Box sx={{ fontSize: '1.1rem' }}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <strong>Saturday:</strong> 10:00 AM - 6:00 PM
                    </Typography>
                    <Typography variant="body1">
                      <strong>Sunday:</strong> 11:00 AM - 5:00 PM
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Mission Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Our Mission
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3, borderRadius: 3 }}>
                <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quality First
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We use only the freshest ingredients and prepare every meal with care and attention to detail.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3, borderRadius: 3 }}>
                <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Customization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every order is tailored to your preferences. Choose exactly what you want, how you want it.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3, borderRadius: 3 }}>
                <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quick and reliable delivery service to get your food to you fresh and on time.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            p: 6,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Order?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Start customizing your perfect meal today!
          </Typography>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Browse Menu
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}


