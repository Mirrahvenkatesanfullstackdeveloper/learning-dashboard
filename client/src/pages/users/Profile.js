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
  ListItemAvatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Badge,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock profile data
  const mockProfile = {
    id: 101,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    role: 'learner',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    bio: 'Passionate full-stack developer with 3 years of experience. Love learning new technologies and sharing knowledge with the community.',
    location: 'San Francisco, CA',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Corp',
    website: 'https://alicejohnson.dev',
    linkedin: 'https://linkedin.com/in/alicejohnson',
    twitter: 'https://twitter.com/alicejohnson',
    github: 'https://github.com/alicejohnson',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    memberSince: '2022-01-15',
    lastActive: new Date().toISOString(),
    
    stats: {
      coursesEnrolled: 8,
      coursesCompleted: 5,
      assignmentsSubmitted: 42,
      assignmentsGraded: 38,
      averageGrade: 87,
      studyStreak: 15,
      achievements: 12,
      followers: 234,
      following: 89,
    },

    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 70 },
      { name: 'MongoDB', level: 75 },
      { name: 'TypeScript', level: 80 },
      { name: 'GraphQL', level: 65 },
    ],

    courses: [
      {
        id: 1,
        title: 'Full Stack Web Development',
        progress: 85,
        grade: 92,
        status: 'in-progress',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        instructor: 'Dr. Jane Smith',
        completedAt: null,
      },
      {
        id: 2,
        title: 'Advanced React Patterns',
        progress: 100,
        grade: 95,
        status: 'completed',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        instructor: 'Prof. John Doe',
        completedAt: '2024-01-15',
      },
      {
        id: 3,
        title: 'Database Design Fundamentals',
        progress: 60,
        grade: 88,
        status: 'in-progress',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
        instructor: 'Dr. Emily Brown',
        completedAt: null,
      },
    ],

    achievements: [
      {
        id: 1,
        title: 'Quick Learner',
        description: 'Completed 5 courses in 3 months',
        icon: '🚀',
        date: '2024-02-15',
        rarity: 'gold',
      },
      {
        id: 2,
        title: 'Perfect Score',
        description: 'Got 100% on Advanced React final exam',
        icon: '🎯',
        date: '2024-01-20',
        rarity: 'platinum',
      },
      {
        id: 3,
        title: 'Consistency King',
        description: '30-day learning streak',
        icon: '🔥',
        date: '2024-02-10',
        rarity: 'silver',
      },
      {
        id: 4,
        title: 'Mentor',
        description: 'Helped 50 students in forums',
        icon: '👨‍🏫',
        date: '2024-01-05',
        rarity: 'bronze',
      },
    ],

    recentActivity: [
      {
        id: 1,
        type: 'course_completed',
        title: 'Completed Advanced React Patterns',
        date: '2024-02-15T10:30:00',
        icon: <SchoolIcon />,
      },
      {
        id: 2,
        type: 'assignment_graded',
        title: 'React Hooks Assignment graded: 95%',
        date: '2024-02-14T15:45:00',
        icon: <AssignmentIcon />,
      },
      {
        id: 3,
        type: 'achievement_unlocked',
        title: 'Unlocked "Quick Learner" achievement',
        date: '2024-02-13T09:20:00',
        icon: <TrophyIcon />,
      },
      {
        id: 4,
        type: 'course_started',
        title: 'Started Database Design Fundamentals',
        date: '2024-02-10T11:00:00',
        icon: <SchoolIcon />,
      },
    ],

    certifications: [
      {
        id: 1,
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-12-15',
        expiry: '2025-12-15',
        credentialId: 'AWS-DEV-12345',
        url: '#',
      },
      {
        id: 2,
        name: 'Meta Frontend Developer',
        issuer: 'Meta',
        date: '2023-10-20',
        expiry: null,
        credentialId: 'META-FE-67890',
        url: '#',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, [id]);

  const isOwnProfile = currentUser?.id === profile?.id || !id;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'platinum': return '#E5E4E2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#667EEA';
    }
  };

  const skillData = profile?.skills.map(skill => ({
    subject: skill.name,
    A: skill.level,
    fullMark: 100,
  }));

  const courseStats = [
    { name: 'Completed', value: profile?.stats.coursesCompleted, color: '#48BB78' },
    { name: 'In Progress', value: profile?.stats.coursesEnrolled - profile?.stats.coursesCompleted, color: '#667EEA' },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Cover Photo and Profile Header */}
      <Paper sx={{ mb: 3, overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            height: 200,
            background: `linear-gradient(135deg, #667EEA 0%, #764BA2 100%), url(${profile?.coverPhoto})`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
            position: 'relative',
          }}
        >
          {isOwnProfile && (
            <IconButton
              sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.2)' }}
              onClick={() => navigate('/settings')}
            >
              <EditIcon sx={{ color: 'white' }} />
            </IconButton>
          )}
        </Box>

        <Box sx={{ p: 3, pt: 0, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Avatar
            src={profile?.profilePicture}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid white',
              marginTop: -6,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            {profile?.firstName[0]}{profile?.lastName[0]}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {profile?.firstName} {profile?.lastName}
              </Typography>
              <Chip
                label={profile?.role}
                color="primary"
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
              {profile?.stats.studyStreak >= 7 && (
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`${profile?.stats.studyStreak} day streak`}
                  color="success"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
              {profile?.bio}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2">{profile?.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2">{profile?.jobTitle} at {profile?.company}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2">Joined {format(new Date(profile?.memberSince), 'MMMM yyyy')}</Typography>
              </Box>
            </Box>
          </Box>

          {!isOwnProfile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                <IconButton onClick={() => setIsBookmarked(!isBookmarked)}>
                  {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share profile">
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 40, color: '#667EEA', mb: 1 }} />
            <Typography variant="h4" color="primary">
              {profile?.stats.coursesEnrolled}
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
              {profile?.stats.assignmentsGraded}
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
              {profile?.stats.averageGrade}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Grade
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 40, color: '#F56565', mb: 1 }} />
            <Typography variant="h4" color="error.main">
              {profile?.stats.achievements}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Achievements
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Overview" />
          <Tab label="Courses" />
          <Tab label="Achievements" />
          <Tab label="Certifications" />
          <Tab label="Activity" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Skills Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Skills Proficiency
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#718096', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#718096' }} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#667EEA"
                      fill="#667EEA"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Course Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Course Progress
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={courseStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {courseStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {profile?.recentActivity.slice(0, 5).map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {activity.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={format(new Date(activity.date), 'MMM dd, yyyy h:mm a')}
                        />
                      </ListItem>
                      {index < 4 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Courses Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {profile?.courses.map((course) => (
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
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#E2E8F0',
                            '& .MuiLinearProgress-bar': {
                              background: course.status === 'completed' 
                                ? 'linear-gradient(135deg, #48BB78 0%, #2F855A 100%)'
                                : 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                            },
                          }}
                        />
                      </Box>
                      {course.grade && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                            Grade:
                          </Typography>
                          <Chip
                            label={`${course.grade}%`}
                            size="small"
                            color={course.grade >= 90 ? 'success' : course.grade >= 70 ? 'primary' : 'warning'}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Achievements Tab */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            {profile?.achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar sx={{ bgcolor: getRarityColor(achievement.rarity), width: 24, height: 24 }}>
                        <StarIcon sx={{ fontSize: 16, color: 'white' }} />
                      </Avatar>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        fontSize: '3rem',
                        bgcolor: getRarityColor(achievement.rarity),
                        margin: '0 auto',
                        mb: 2,
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                  </Badge>
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

        {/* Certifications Tab */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            {profile?.certifications.map((cert) => (
              <Grid item xs={12} md={6} key={cert.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                        <TrophyIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {cert.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cert.issuer}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Issued
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(cert.date), 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      {cert.expiry && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Expires
                          </Typography>
                          <Typography variant="body2">
                            {format(new Date(cert.expiry), 'MMM dd, yyyy')}
                          </Typography>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Credential ID
                        </Typography>
                        <Typography variant="body2">
                          {cert.credentialId}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      variant="outlined"
                      href={cert.url}
                      target="_blank"
                      sx={{ mt: 2 }}
                    >
                      View Certificate
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Activity Tab */}
        {tabValue === 4 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Activity
            </Typography>
            <List>
              {profile?.recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={format(new Date(activity.date), 'MMMM dd, yyyy h:mm a')}
                    />
                  </ListItem>
                  {index < profile.recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Contact Info Sidebar */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={profile?.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="Phone" secondary={profile?.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Website"
                  secondary={
                    <a href={profile?.website} target="_blank" rel="noopener noreferrer">
                      {profile?.website}
                    </a>
                  }
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Social Profiles
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {profile?.github && (
                <IconButton href={profile.github} target="_blank">
                  <GitHubIcon />
                </IconButton>
              )}
              {profile?.linkedin && (
                <IconButton href={profile.linkedin} target="_blank">
                  <LinkedInIcon />
                </IconButton>
              )}
              {profile?.twitter && (
                <IconButton href={profile.twitter} target="_blank">
                  <TwitterIcon />
                </IconButton>
              )}
              {profile?.facebook && (
                <IconButton href={profile.facebook} target="_blank">
                  <FacebookIcon />
                </IconButton>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About {profile?.firstName}
            </Typography>
            <Typography variant="body1" paragraph>
              {profile?.bio}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Skills & Expertise
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {profile?.skills.map((skill) => (
                <Tooltip key={skill.name} title={`${skill.level}% proficiency`}>
                  <Chip
                    label={skill.name}
                    sx={{
                      bgcolor: `rgba(102, 126, 234, ${skill.level / 100})`,
                      color: skill.level > 50 ? 'white' : 'text.primary',
                    }}
                  />
                </Tooltip>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Stats Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
                <Typography variant="h6">{profile?.stats.followers}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
                <Typography variant="h6">{profile?.stats.following}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Study Streak
                </Typography>
                <Typography variant="h6">{profile?.stats.studyStreak} days</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="h6">
                  {format(new Date(profile?.memberSince), 'MMM yyyy')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;