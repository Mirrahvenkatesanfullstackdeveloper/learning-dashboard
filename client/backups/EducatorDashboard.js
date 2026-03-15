import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Rating,
  Tabs,
  Tab,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StyledCard from '../../components/Cards/StyledCard';
import { backgrounds } from '../../assets/images/backgrounds';

// Mock data for educator dashboard
const performanceData = [
  { name: 'Week 1', average: 85, submissions: 45 },
  { name: 'Week 2', average: 82, submissions: 52 },
  { name: 'Week 3', average: 88, submissions: 48 },
  { name: 'Week 4', average: 90, submissions: 55 },
  { name: 'Week 5', average: 87, submissions: 50 },
  { name: 'Week 6', average: 92, submissions: 58 },
];

const myCourses = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    students: 145,
    progress: 65,
    pendingAssignments: 23,
    averageGrade: 86,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    students: 89,
    progress: 42,
    pendingAssignments: 15,
    averageGrade: 92,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  },
  {
    id: 3,
    title: 'Database Design Fundamentals',
    students: 67,
    progress: 78,
    pendingAssignments: 8,
    averageGrade: 81,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
  },
];

const pendingGrading = [
  {
    id: 1,
    student: 'Alice Johnson',
    assignment: 'React Hooks Assignment',
    submittedAt: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 2,
    student: 'Bob Smith',
    assignment: 'Database Normalization Quiz',
    submittedAt: '5 hours ago',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 3,
    student: 'Carol White',
    assignment: 'REST API Design',
    submittedAt: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 4,
    student: 'David Brown',
    assignment: 'Authentication Implementation',
    submittedAt: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: 'Final Project Submission',
    course: 'Full Stack Web Development',
    due: 'Tomorrow',
    submissions: 32,
    total: 145,
  },
  {
    id: 2,
    title: 'Midterm Quiz',
    course: 'Advanced React Patterns',
    due: 'In 3 days',
    submissions: 0,
    total: 89,
  },
  {
    id: 3,
    title: 'Database Design Project',
    course: 'Database Design Fundamentals',
    due: 'Next week',
    submissions: 12,
    total: 67,
  },
];

const EducatorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const StatCard = ({ title, value, icon, subtitle, color }) => (
    <StyledCard
      gradient={`linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`}
      pattern={backgrounds.pattern2}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );

  return (
    <Container maxWidth="xl">
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, Professor {user?.lastName}! 📚
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your courses and student performance.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={301}
            icon={<PeopleIcon />}
            subtitle="Across all courses"
            color="#667EEA"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Courses"
            value={3}
            icon={<SchoolIcon />}
            subtitle="2 published, 1 draft"
            color="#F8B042"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Grading"
            value={46}
            icon={<GradeIcon />}
            subtitle="28% increase"
            color="#48BB78"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Grade"
            value="86%"
            icon={<TrendingUpIcon />}
            subtitle="B+ average"
            color="#F56565"
          />
        </Grid>
      </Grid>

      {/* Performance Chart and Pending Grading */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Class Performance Trend
              </Typography>
              <Chip
                icon={<TrendingUpIcon />}
                label="+5.2% vs last month"
                color="success"
                size="small"
              />
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis yAxisId="left" stroke="#718096" />
                <YAxis yAxisId="right" orientation="right" stroke="#718096" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="average"
                  stroke="#667EEA"
                  strokeWidth={2}
                  name="Average Grade %"
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="submissions"
                  stroke="#48BB78"
                  strokeWidth={2}
                  name="Submissions"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Pending Grading
            </Typography>
            <List>
              {pendingGrading.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={item.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.student}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {item.assignment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Submitted {item.submittedAt}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/assignments/grade')}
                        startIcon={<GradeIcon />}
                      >
                        Grade
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < pendingGrading.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/assignments/submissions')}
            >
              View All Submissions
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* My Courses */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            My Courses
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/courses/create')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Create New Course
          </Button>
        </Box>

        <Grid container spacing={3}>
          {myCourses.map((course) => (
            <Grid item xs={12} md={4} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                  },
                }}
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <Box
                  sx={{
                    height: 140,
                    background: `linear-gradient(135deg, #667EEA 0%, #764BA2 100%), url(${course.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'overlay',
                    position: 'relative',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {course.title}
                  </Typography>
                </Box>
                <CardContent>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {course.students}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Students
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {course.pendingAssignments}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pending
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{course.progress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={course.averageGrade / 20} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {course.averageGrade}%
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.id}/edit`);
                    }}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Upcoming Deadlines and Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Upcoming Deadlines
            </Typography>
            <List>
              {upcomingDeadlines.map((deadline, index) => (
                <React.Fragment key={deadline.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 
                        deadline.due === 'Tomorrow' ? '#F5656520' :
                        deadline.due === 'In 3 days' ? '#F8B04220' : '#48BB7820'
                      }}>
                        {deadline.due === 'Tomorrow' ? <WarningIcon sx={{ color: '#F56565' }} /> :
                         deadline.due === 'In 3 days' ? <ScheduleIcon sx={{ color: '#F8B042' }} /> :
                         <CheckCircleIcon sx={{ color: '#48BB78' }} />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={deadline.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {deadline.course}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(deadline.submissions / deadline.total) * 100}
                              sx={{
                                width: 100,
                                height: 4,
                                borderRadius: 2,
                                mr: 1,
                              }}
                            />
                            <Typography variant="caption">
                              {deadline.submissions}/{deadline.total} submitted
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={deadline.due}
                        color={
                          deadline.due === 'Tomorrow' ? 'error' :
                          deadline.due === 'In 3 days' ? 'warning' : 'success'
                        }
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < upcomingDeadlines.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => navigate('/assignments/create')}
                >
                  <AssignmentIcon sx={{ fontSize: 32, mb: 1, color: '#667EEA' }} />
                  <Typography variant="body2">Create Assignment</Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => navigate('/grades')}
                >
                  <GradeIcon sx={{ fontSize: 32, mb: 1, color: '#48BB78' }} />
                  <Typography variant="body2">View Grades</Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => navigate('/study-plans/create')}
                >
                  <ScheduleIcon sx={{ fontSize: 32, mb: 1, color: '#F8B042' }} />
                  <Typography variant="body2">Create Study Plan</Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => navigate('/reports')}
                >
                  <TrendingUpIcon sx={{ fontSize: 32, mb: 1, color: '#F56565' }} />
                  <Typography variant="body2">View Reports</Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EducatorDashboard;