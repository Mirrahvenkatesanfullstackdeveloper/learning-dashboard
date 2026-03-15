import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: '#48BB78', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your purchase. You will receive a confirmation email shortly.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/courses')}
          sx={{ mt: 2 }}
        >
          Go to My Courses
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;