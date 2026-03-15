import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <ErrorIcon sx={{ fontSize: 80, color: '#F56565', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Payment Failed</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          There was an issue processing your payment. Please try again.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/payments')}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentFailed;