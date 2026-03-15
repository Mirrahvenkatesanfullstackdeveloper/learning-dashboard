import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  WhatsApp as WhatsAppIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  CheckCircle as CheckCircleIcon,
  BugReport as BugIcon,
  Feedback as FeedbackIcon,
  Help as HelpIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  category: yup.string().required('Please select a category'),
  message: yup.string().required('Message is required').min(20, 'Message must be at least 20 characters'),
  priority: yup.string().required('Please select priority'),
});

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form data:', data);
    setSubmitting(false);
    setSubmitSuccess(true);
    reset();
    
    setSnackbar({
      open: true,
      message: 'Your message has been sent successfully! We\'ll respond within 24 hours.',
      severity: 'success',
    });
  };

  const categories = [
    { value: 'technical', label: 'Technical Support', icon: <BugIcon /> },
    { value: 'billing', label: 'Billing & Payments', icon: <PaymentIcon /> },
    { value: 'account', label: 'Account Issues', icon: <HelpIcon /> },
    { value: 'courses', label: 'Course Questions', icon: <SchoolIcon /> },
    { value: 'assignments', label: 'Assignment Help', icon: <AssignmentIcon /> },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: <FeedbackIcon /> },
    { value: 'other', label: 'Other', icon: <HelpIcon /> },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#48BB78' },
    { value: 'medium', label: 'Medium', color: '#F8B042' },
    { value: 'high', label: 'High', color: '#F56565' },
    { value: 'urgent', label: 'Urgent', color: '#9F7AEA' },
  ];

  const supportHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM EST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  const responseTimes = [
    { channel: 'Email', time: 'Within 24 hours' },
    { channel: 'Live Chat', time: '5-10 minutes' },
    { channel: 'Phone', time: 'Immediate (during business hours)' },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Contact Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get in touch with our support team. We're here to help!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Send us a message
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fill out the form below and we'll get back to you as soon as possible.
            </Typography>

            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for contacting us! We'll respond within 24 hours.
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    {...register('subject')}
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select {...register('category')} label="Category">
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'transparent', color: 'primary.main' }}>
                              {cat.icon}
                            </Avatar>
                            {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.priority}>
                    <InputLabel>Priority</InputLabel>
                    <Select {...register('priority')} label="Priority">
                      {priorities.map((p) => (
                        <MenuItem key={p.value} value={p.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: p.color,
                                mr: 1,
                              }}
                            />
                            {p.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.priority && (
                      <FormHelperText>{errors.priority.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Message"
                    {...register('message')}
                    error={!!errors.message}
                    helperText={errors.message?.message || 'Please provide as much detail as possible'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    startIcon={submitting ? <LinearProgress /> : <SendIcon />}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          {/* Quick Contact */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Contact
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary="support@learningdashboard.com"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary="+1 (555) 123-4567"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChatIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Live Chat"
                  secondary="Available 24/7"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Office"
                  secondary="123 Learning St, Education City, EC 12345"
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ bgcolor: '#25D36620', color: '#25D366' }}>
                <WhatsAppIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#1DA1F220', color: '#1DA1F2' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#4267B220', color: '#4267B2' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#0077B520', color: '#0077B5' }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* Support Hours */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Support Hours
            </Typography>
            <List dense>
              {supportHours.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.day}
                    secondary={item.hours}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Response Times */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Expected Response Times
            </Typography>
            <List dense>
              {responseTimes.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.channel}
                    secondary={item.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;