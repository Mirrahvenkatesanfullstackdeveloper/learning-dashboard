import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Payment as PayPalIcon,
  CheckCircle as SuccessIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { backgrounds } from '../../assets/images/backgrounds';

const steps = ['Payment Method', 'Payment Details', 'Confirmation'];

const Payments = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Sample course data
  const course = {
    title: 'Full Stack Web Development',
    price: 499.99,
    discountedPrice: 399.99,
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePayment = (data) => {
    // Simulate payment processing
    toast.info('Processing payment...');
    
    setTimeout(() => {
      setPaymentSuccess(true);
      toast.success('Payment successful!');
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/payments/success');
      }, 2000);
    }, 1500);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    border: paymentMethod === 'credit_card' ? '2px solid #667eea' : '1px solid #e2e8f0',
                    borderRadius: 2,
                  }}
                >
                  <FormControlLabel
                    value="credit_card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CreditCardIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2">Credit / Debit Card</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pay securely with your card
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    border: paymentMethod === 'paypal' ? '2px solid #667eea' : '1px solid #e2e8f0',
                    borderRadius: 2,
                  }}
                >
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PayPalIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2">PayPal</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pay with your PayPal account
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    border: paymentMethod === 'bank_transfer' ? '2px solid #667eea' : '1px solid #e2e8f0',
                    borderRadius: 2,
                  }}
                >
                  <FormControlLabel
                    value="bank_transfer"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BankIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2">Bank Transfer</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Direct bank transfer (may take 1-2 days)
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 1:
        return paymentMethod === 'credit_card' ? (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  {...register('cardNumber', { required: true })}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber && 'Card number is required'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                  {...register('expiryDate', { required: true })}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate && 'Expiry date is required'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  placeholder="123"
                  type="password"
                  {...register('cvv', { required: true })}
                  error={!!errors.cvv}
                  helperText={errors.cvv && 'CVV is required'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  placeholder="John Doe"
                  {...register('cardholderName', { required: true })}
                  error={!!errors.cardholderName}
                  helperText={errors.cardholderName && 'Cardholder name is required'}
                />
              </Grid>
            </Grid>
          </Box>
        ) : paymentMethod === 'paypal' ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PayPalIcon sx={{ fontSize: 64, color: '#0070ba', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Redirecting to PayPal
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You will be redirected to PayPal to complete your payment securely.
            </Typography>
            <Button
              variant="contained"
              startIcon={<PayPalIcon />}
              sx={{ mt: 2 }}
            >
              Continue with PayPal
            </Button>
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please transfer the exact amount to the following bank account
            </Alert>
            <Paper sx={{ p: 3, background: '#f7f9fc' }}>
              <Typography variant="subtitle2" gutterBottom>
                Bank Details:
              </Typography>
              <Typography variant="body2" paragraph>
                Bank: Example Bank<br />
                Account Name: Learning Dashboard Inc.<br />
                Account Number: 1234567890<br />
                Routing Number: 021000021<br />
                SWIFT Code: EXBKUS33<br />
                Amount: ${course.discountedPrice || course.price}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Please include your order number in the transfer description
              </Typography>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Please review your order before confirming
            </Alert>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Course:</Typography>
                <Typography variant="body2" fontWeight={600}>{course.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Original Price:</Typography>
                <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                  ${course.price}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Discount:</Typography>
                <Typography variant="body2" color="success.main">
                  -${(course.price - course.discountedPrice).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${course.discountedPrice}
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Payment Method
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {paymentMethod === 'credit_card' && <CreditCardIcon />}
                {paymentMethod === 'paypal' && <PayPalIcon />}
                {paymentMethod === 'bank_transfer' && <BankIcon />}
                <Typography variant="body2">
                  {paymentMethod === 'credit_card' && 'Credit / Debit Card'}
                  {paymentMethod === 'paypal' && 'PayPal'}
                  {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (paymentSuccess) {
    return (
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <SuccessIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for your purchase. You will receive a confirmation email shortly.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/courses')}
            sx={{
              mt: 2,
              background: 'white',
              color: '#667eea',
              '&:hover': {
                background: '#f5f5f5',
              },
            }}
          >
            Go to My Courses
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
          Complete Your Payment
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Secure payment powered by industry-standard encryption
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
          <LockIcon fontSize="small" color="success" />
          <Typography variant="caption" color="success.main">
            Your payment information is secure
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(handlePayment)}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              type={activeStep === steps.length - 1 ? 'submit' : 'button'}
              variant="contained"
              onClick={activeStep === steps.length - 1 ? undefined : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Pay Now' : 'Continue'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Payments;