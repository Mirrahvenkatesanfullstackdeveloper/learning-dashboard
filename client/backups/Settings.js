import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Slider,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  PrivacyTip as PrivacyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TwoWheeler as TwoFactorIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
  location: yup.string(),
  jobTitle: yup.string(),
  company: yup.string(),
  website: yup.string().url('Invalid URL'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    assignmentReminders: true,
    courseUpdates: true,
    promotionalEmails: false,
    discussionReplies: true,
    gradingUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showCourses: true,
    showAchievements: true,
    allowMessages: 'everyone',
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    emailFrequency: 'daily',
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      jobTitle: user?.jobTitle || '',
      company: user?.company || '',
      website: user?.website || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSave = (data) => {
    console.log('Profile data:', data);
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success',
    });
  };

  const onPasswordChange = (data) => {
    console.log('Password data:', data);
    setSnackbar({
      open: true,
      message: 'Password changed successfully!',
      severity: 'success',
    });
    resetPassword();
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Settings Navigation */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Tabs
              orientation="vertical"
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab icon={<EditIcon />} label="Profile" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<PaletteIcon />} label="Preferences" />
              <Tab icon={<PrivacyIcon />} label="Privacy" />
              <Tab icon={<PaymentIcon />} label="Payments" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Settings Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 4 }}>
            {/* Profile Settings */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Update your personal information and public profile
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    src={user?.profilePicture}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ mr: 1 }}
                    >
                      Change Photo
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>

                <form onSubmit={handleProfileSubmit(onProfileSave)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        {...registerProfile('firstName')}
                        error={!!profileErrors.firstName}
                        helperText={profileErrors.firstName?.message}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        {...registerProfile('lastName')}
                        error={!!profileErrors.lastName}
                        helperText={profileErrors.lastName?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        {...registerProfile('email')}
                        error={!!profileErrors.email}
                        helperText={profileErrors.email?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        {...registerProfile('phone')}
                        error={!!profileErrors.phone}
                        helperText={profileErrors.phone?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Bio"
                        {...registerProfile('bio')}
                        error={!!profileErrors.bio}
                        helperText={profileErrors.bio?.message}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        {...registerProfile('location')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        {...registerProfile('jobTitle')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        {...registerProfile('company')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Website"
                        {...registerProfile('website')}
                        error={!!profileErrors.website}
                        helperText={profileErrors.website?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}

            {/* Security Settings */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your password and account security
                </Typography>

                <form onSubmit={handlePasswordSubmit(onPasswordChange)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        {...registerPassword('currentPassword')}
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        {...registerPassword('newPassword')}
                        error={!!passwordErrors.newPassword}
                        helperText={passwordErrors.newPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        {...registerPassword('confirmPassword')}
                        error={!!passwordErrors.confirmPassword}
                        helperText={passwordErrors.confirmPassword?.message}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TwoFactorIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Two-Factor Authentication"
                        secondary="Add an extra layer of security to your account"
                      />
                      <ListItemSecondaryAction>
                        <Switch />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      Update Password
                    </Button>
                  </Box>
                </form>
              </Box>
            )}

            {/* Notification Settings */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose how you want to receive notifications
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive updates via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive notifications in browser"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="SMS Notifications"
                      secondary="Receive text messages"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={() => handleNotificationChange('smsNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Notification Types
                </Typography>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Assignment Reminders"
                      secondary="Get reminded about upcoming assignments"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.assignmentReminders}
                        onChange={() => handleNotificationChange('assignmentReminders')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Course Updates"
                      secondary="New content and course announcements"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.courseUpdates}
                        onChange={() => handleNotificationChange('courseUpdates')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Grading Updates"
                      secondary="When your assignments are graded"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.gradingUpdates}
                        onChange={() => handleNotificationChange('gradingUpdates')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Discussion Replies"
                      secondary="When someone replies to your comments"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.discussionReplies}
                        onChange={() => handleNotificationChange('discussionReplies')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Promotional Emails"
                      secondary="Receive offers and promotions"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.promotionalEmails}
                        onChange={() => handleNotificationChange('promotionalEmails')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Notification preferences updated!',
                        severity: 'success',
                      });
                    }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Box>
            )}

            {/* Preferences */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Application Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Customize your learning experience
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={preferences.theme}
                        label="Theme"
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="system">System Default</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={preferences.language}
                        label="Language"
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="zh">Chinese</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Time Zone</InputLabel>
                      <Select
                        value={preferences.timezone}
                        label="Time Zone"
                        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                      >
                        <MenuItem value="America/New_York">Eastern Time</MenuItem>
                        <MenuItem value="America/Chicago">Central Time</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        <MenuItem value="Europe/London">GMT</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Email Frequency</InputLabel>
                      <Select
                        value={preferences.emailFrequency}
                        label="Email Frequency"
                        onChange={(e) => handlePreferenceChange('emailFrequency', e.target.value)}
                      >
                        <MenuItem value="realtime">Real-time</MenuItem>
                        <MenuItem value="daily">Daily Digest</MenuItem>
                        <MenuItem value="weekly">Weekly Digest</MenuItem>
                        <MenuItem value="never">Never</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Preferences updated!',
                        severity: 'success',
                      });
                    }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Box>
            )}

            {/* Privacy Settings */}
            {tabValue === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Control who can see your information
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Profile Visibility</FormLabel>
                  <RadioGroup
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  >
                    <FormControlLabel value="public" control={<Radio />} label="Public - Anyone can see" />
                    <FormControlLabel value="private" control={<Radio />} label="Private - Only me" />
                    <FormControlLabel value="followers" control={<Radio />} label="Followers Only" />
                  </RadioGroup>
                </FormControl>

                <Divider sx={{ my: 3 }} />

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Show Email"
                      secondary="Display your email on your profile"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={privacy.showEmail}
                        onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Show Phone"
                      secondary="Display your phone number"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={privacy.showPhone}
                        onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Show Courses"
                      secondary="Display your enrolled courses"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={privacy.showCourses}
                        onChange={(e) => handlePrivacyChange('showCourses', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Show Achievements"
                      secondary="Display your achievements and certificates"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={privacy.showAchievements}
                        onChange={(e) => handlePrivacyChange('showAchievements', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Who can message you</FormLabel>
                  <RadioGroup
                    value={privacy.allowMessages}
                    onChange={(e) => handlePrivacyChange('allowMessages', e.target.value)}
                  >
                    <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
                    <FormControlLabel value="followers" control={<Radio />} label="Followers Only" />
                    <FormControlLabel value="none" control={<Radio />} label="No one" />
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Privacy settings updated!',
                        severity: 'success',
                      });
                    }}
                  >
                    Save Settings
                  </Button>
                </Box>
              </Box>
            )}

            {/* Payment Settings */}
            {tabValue === 5 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Methods
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your payment methods and billing information
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                  This is a demo. No actual payment processing is implemented.
                </Alert>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="💳 Visa ending in 4242"
                      secondary="Expires 12/25"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Default" color="primary" size="small" sx={{ mr: 1 }} />
                      <Button size="small">Edit</Button>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="💳 Mastercard ending in 5555"
                      secondary="Expires 08/24"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small">Edit</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Button
                  variant="outlined"
                  startIcon={<PaymentIcon />}
                  sx={{ mt: 2 }}
                >
                  Add Payment Method
                </Button>

                <Divider sx={{ my: 4 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Billing Address
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Street Address" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="City" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="State/Province" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="ZIP/Postal Code" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Country" />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button variant="contained">
                    Update Billing Address
                  </Button>
                </Box>
              </Box>
            )}
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

export default Settings;