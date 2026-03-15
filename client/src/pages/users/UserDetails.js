import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  Badge,
  Alert,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Edit as EditIcon,
  Message as MessageIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Mock user data
  const mockUser = {
    id: 3,
    firstName: 'Bob',
    lastName: 'Learner',
    email: 'learner@example.com',
    role: 'learner',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    isActive: true,
    isEmailVerified: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    bio: 'Eager to learn full-stack development. Currently working through the Full Stack Web Development bootcamp.',
    location: 'Austin, TX',
    jobTitle: 'Junior Developer',
    company: 'Tech Startup',
    phone: '+1 (512) 555-1234',
    website: 'https://boblearner.dev',
    
    stats: {
      enrolledCourses: 4,
      completedCourses: 2,
      inProgressCourses: 2,
      assignmentsSubmitted: 28,
      assignmentsGraded: 24,
      averageGrade: 87,
      studyStreak: 12,
      achievements: 8,
      totalHours: 156,
    },

    enrolledCourses: [
      {
        id: 1,
        title: 'Full Stack Web Development',
        progress: 85,
        grade: 92,
        status: 'in-progress',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        instructor: 'Dr. Jane Smith',
        enrolledDate: '2024-01-15',
        lastAccess: '2024-02-18',
      },
      {
        id: 2,
        title: 'Advanced React Patterns',
        progress: 100,
        grade: 95,
        status: 'completed',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        instructor: 'Prof. John Doe',
        enrolledDate: '2023-12-10',
        completedDate: '2024-02-01',
      },
      {
        id: 3,
        title: 'Database Design Fundamentals',
        progress: 60,
        grade: 88,
        status: 'in-progress',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
        instructor: 'Dr. Emily Brown',
        enrolledDate: '2024-01-20',
        lastAccess: '2024-02-17',
      },
      {
        id: 4,
        title: 'JavaScript Essentials',
        progress: 100,
        grade: 98,
        status: 'completed',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
        instructor: 'Prof. Michael Chen',
        enrolledDate: '2023-11-05',
        completedDate: '2023-12-20',
      },
    ],

    achievements: [
      {
        id: 1,
        title: 'Quick Learner',
        description: 'Completed 2 courses in first month',
        icon: '🚀',
        date: '2024-01-15',
      },
      {
        id: 2,
        title: 'Perfect Score',
        description: 'Got 100% on JavaScript final exam',
        icon: '🎯',
        date: '2023-12-20',
      },
      {
        id: 3,
        title: 'Consistency King',
        description: '12-day learning streak',
        icon: '🔥',
        date: '2024-02-18',
      },
    ],

    recentActivity: [
      {
        id: 1,
        type: 'course_completed',
        title: 'Completed Advanced React Patterns',
        date: '2024-02-01T14:30:00',
      },
      {
        id: 2,
        type: 'assignment_graded',
        title: 'React Hooks Assignment graded: 95%',
        date: '2024-01-28T10:15:00',
      },
      {
        id: 3,
        type: 'course_started',
        title: 'Started Database Design Fundamentals',
        date: '2024-01-20T09:00:00',
      },
    ],

    paymentHistory: [
      {
        id: 1,
        date: '2024-01-15',
        amount: 399.99,
        course: 'Full Stack Web Development',
        status: 'completed',
      },
      {
        id: 2,
        date: '2023-12-10',
        amount: 249.99,
        course: 'Advanced React Patterns',
        status: 'completed',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'coordinator': return 'error';
      case 'educator': return 'warning';
      case 'learner': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/users" color="inherit">
          Users
        </Link>
        <Typography color="text.primary">
          {user?.firstName} {user?.lastName}
        </Typography>
      </Breadcrumbs>

      {/* Header Actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
        >
          Back to Users
        </Button>
        <Box>
          <Tooltip title="Send Message">
            <IconButton sx={{ mr: 1 }}>
              <MessageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit User">
            <IconButton sx={{ mr: 1 }} onClick={() => navigate(`/users/${id}/edit`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={user?.isActive ? 'Deactivate' : 'Activate'}>
            <IconButton sx={{ mr: 1 }} color={user?.isActive ? 'error' : 'success'}>
              {user?.isActive ? <BlockIcon /> : <CheckCircleIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Profile Header */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 150,
            background: `linear-gradient(135deg, #667EEA 0%, #764BA2 100%), url(${user?.coverPhoto})`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
          }}
        />
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: user?.isActive ? '#48BB78' : '#A0AEC0',
                  border: '2px solid white',
                }}
              />
            }
          >
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 100,
                height: 100,
                border: '4px solid white',
                marginTop: -5,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {user?.firstName[0]}{user?.lastName[0]}
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Chip
                label={user?.role}
                color={getRoleColor(user?.role)}
                sx={{ textTransform: 'capitalize' }}
              />
              {user?.isEmailVerified && (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Verified"
                  color="success"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
              {user?.bio}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2">{user?.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2">{user?.phone}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2">{user?.location}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2">{user?.jobTitle} at {user?.company}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 40, color: '#667EEA', mb: 1 }} />
            <Typography variant="h4" color="primary">
              {user?.stats.enrolledCourses}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Courses Enrolled
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 40, color: '#48BB78', mb: 1 }} />
            <Typography variant="h4" color="success.main">
              {user?.stats.assignmentsGraded}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assignments Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <StarIcon sx={{ fontSize: 40, color: '#F8B042', mb: 1 }} />
            <Typography variant="h4" color="warning.main">
              {user?.stats.averageGrade}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Grade
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TimeIcon sx={{ fontSize: 40, color: '#F56565', mb: 1 }} />
            <Typography variant="h4" color="error.main">
              {user?.stats.studyStreak}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Day Streak
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Courses" />
          <Tab label="Achievements" />
          <Tab label="Activity" />
          <Tab label="Payments" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {/* Courses Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {user?.enrolledCourses.map((course) => (
              <Grid item xs={12} md={6} key={course.id}>
                <Card
                  sx={{
                    display: 'flex',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
                    },
                  }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 120, objectFit: 'cover' }}
                    image={course.thumbnail}
                    alt={course.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle2">
                        {course.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {course.instructor}
                      </Typography>
                      
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Progress</Typography>
                          <Typography variant="caption">{course.progress}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          color={getStatusColor(course.status)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip
                          size="small"
                          label={`Grade: ${course.grade}%`}
                          color={course.grade >= 90 ? 'success' : course.grade >= 70 ? 'primary' : 'warning'}
                        />
                        <Chip
                          size="small"
                          label={course.status}
                          color={getStatusColor(course.status)}
                        />
                      </Box>

                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Enrolled: {format(new Date(course.enrolledDate), 'MMM dd, yyyy')}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Achievements Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {user?.achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      fontSize: '3rem',
                      bgcolor: '#667EEA20',
                      color: '#667EEA',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {achievement.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Earned {format(new Date(achievement.date), 'MMM dd, yyyy')}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Activity Tab */}
        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <List>
              {user?.recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                        {activity.type === 'course_completed' && <SchoolIcon />}
                        {activity.type === 'assignment_graded' && <AssignmentIcon />}
                        {activity.type === 'course_started' && <SchoolIcon />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={format(new Date(activity.date), 'MMMM dd, yyyy h:mm a')}
                    />
                  </ListItem>
                  {index < user.recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* Payments Tab */}
        {tabValue === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            <List>
              {user?.paymentHistory.map((payment, index) => (
                <React.Fragment key={payment.id}>
                  <ListItem>
                    <ListItemText
                      primary={payment.course}
                      secondary={`Paid on ${format(new Date(payment.date), 'MMM dd, yyyy')}`}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="primary">
                        ${payment.amount}
                      </Typography>
                      <Chip
                        size="small"
                        label={payment.status}
                        color="success"
                      />
                    </Box>
                  </ListItem>
                  {index < user.paymentHistory.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Additional Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Member Since"
                  secondary={format(new Date(user?.createdAt), 'MMMM dd, yyyy')}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Last Login"
                  secondary={format(new Date(user?.lastLogin), 'MMMM dd, yyyy h:mm a')}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Total Learning Hours"
                  secondary={`${user?.stats.totalHours} hours`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MessageIcon />}
                >
                  Send Message
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/users/${id}/edit`)}
                >
                  Edit Profile
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color={user?.isActive ? 'error' : 'success'}
                  startIcon={user?.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                >
                  {user?.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete User
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDetails;