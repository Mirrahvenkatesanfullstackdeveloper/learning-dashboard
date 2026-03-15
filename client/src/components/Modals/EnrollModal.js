import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Star as StarIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const steps = ['Course Overview', 'Select Plan', 'Payment', 'Confirmation'];

const EnrollModal = ({
  open,
  onClose,
  course,
  onEnroll,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Access',
      price: course?.price,
      duration: 'Lifetime access',
      features: [
        'Full course access',
        'Downloadable resources',
        'Certificate of completion',
        'Email support',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Access',
      price: course?.price * 1.5,
      duration: 'Lifetime access',
      features: [
        'Everything in Basic',
        '1-on-1 mentoring',
        'Priority support',
        'Project reviews',
        'Job assistance',
      ],
    },
    {
      id: 'installment',
      name: 'Installment Plan',
      price: course?.price * 0.4,
      duration: '3 monthly payments',
      features: [
        'Full course access',
        'Pay in 3 installments',
        'All course materials',
        'Certificate on completion',
      ],
    },
  ];

  const paymentMethods = [
    { id: 'credit_card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Complete enrollment
      setEnrollmentComplete(true);
      if (onEnroll) {
        onEnroll({
          plan: selectedPlan,
          paymentMethod,
        });
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={course?.thumbnail || 'https://source.unsplash.com/random/800x600/?coding'}
                alt={course?.title}
              />
            </Card>
            
            <Typography variant="h5" gutterBottom>
              {course?.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<SchoolIcon />}
                label={course?.level}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<ScheduleIcon />}
                label={`${Math.floor(course?.totalDuration / 60)}h`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<PeopleIcon />}
                label={`${course?.totalEnrollments} students`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<StarIcon />}
                label={course?.averageRating}
                size="small"
                variant="outlined"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {course?.description}
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              What you'll learn:
            </Typography>
            <List>
              {course?.learningObjectives?.map((objective, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={objective} />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select your enrollment plan
            </Typography>
            <RadioGroup value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: selectedPlan === plan.id ? '2px solid #667eea' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <FormControlLabel
                    value={plan.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {plan.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {plan.duration}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${plan.price}
                        </Typography>
                        <List dense>
                          {plan.features.map((feature, idx) => (
                            <ListItem key={idx}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', width: '100%' }}
                  />
                </Card>
              ))}
            </RadioGroup>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Payment Method
            </Typography>
            
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: paymentMethod === method.id ? '2px solid #667eea' : '1px solid #E2E8F0',
                  }}
                >
                  <FormControlLabel
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6">{method.icon}</Typography>
                        <Typography variant="body2">{method.label}</Typography>
                      </Box>
                    }
                  />
                </Card>
              ))}
            </RadioGroup>

            {paymentMethod === 'credit_card' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                  <TextField
                    fullWidth
                    label="CVV"
                    type="password"
                    placeholder="123"
                  />
                </Box>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 3 }}>
              This is a demo payment. No actual payment will be processed.
            </Alert>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            {enrollmentComplete ? (
              <Box>
                <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Enrollment Successful!
                </Typography>
                <Typography color="text.secondary">
                  You are now enrolled in {course?.title}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Your Enrollment
                </Typography>
                
                <Card sx={{ p: 3, mb: 3, bgcolor: '#F7F9FC' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Plan:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Method:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {paymentMethods.find(p => p.id === paymentMethod)?.label}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Total:</Typography>
                    <Typography variant="h5" color="primary">
                      ${plans.find(p => p.id === selectedPlan)?.price}
                    </Typography>
                  </Box>
                </Card>
                
                <Typography variant="body2" color="text.secondary">
                  By clicking "Complete Enrollment", you agree to our Terms of Service and Privacy Policy.
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: 600 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" align="center" sx={{ fontWeight: 700 }}>
          Enroll in Course
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || enrollmentComplete}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            (activeStep === 1 && !selectedPlan) ||
            (activeStep === 2 && !paymentMethod) ||
            enrollmentComplete
          }
        >
          {activeStep === steps.length - 1 ? 'Complete Enrollment' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnrollModal;