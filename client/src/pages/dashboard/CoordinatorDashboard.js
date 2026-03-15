import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
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
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StyledCard from '../../components/Cards/StyledCard';
import ProgressChart from '../../components/Charts/ProgressChart';
import { backgrounds } from '../../assets/images/backgrounds';

// Mock data for coordinator dashboard
const enrollmentData = [
  { name: 'Jan', enrollments: 65, completions: 45 },
  { name: 'Feb', enrollments: 85, completions: 55 },
  { name: 'Mar', enrollments: 120, completions: 75 },
  { name: 'Apr', enrollments: 150, completions: 95 },
  { name: 'May', enrollments: 180, completions: 120 },
  { name: 'Jun', enrollments: 210, completions: 145 },
];

const revenueData = [
  { name: 'Week 1', revenue: 4500 },
  { name: 'Week 2', revenue: 5200 },
  { name: 'Week 3', revenue: 6100 },
  { name: 'Week 4', revenue: 5800 },
  { name: 'Week 5', revenue: 7200 },
  { name: 'Week 6', revenue: 8900 },
];

const coursePerformance = [
  { name: 'Web Development', students: 245, completion: 78 },
  { name: 'Data Science', students: 180, completion: 82 },
  { name: 'UI/UX Design', students: 120, completion: 71 },
  { name: 'Mobile Development', students: 95, completion: 65 },
  { name: 'DevOps', students: 75, completion: 88 },
];

const recentActivities = [
  {
    id: 1,
    type: 'enrollment',
    user: 'John Doe',
    action: 'enrolled in',
    target: 'Full Stack Web Development',
    time: '5 minutes ago',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    type: 'submission',
    user: 'Jane Smith',
    action: 'submitted',
    target: 'React Assignment',
    time: '15 minutes ago',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 3,
    type: 'grade',
    user: 'Dr. Johnson',
    action: 'graded',
    target: 'Database Design Quiz',
    time: '1 hour ago',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 4,
    type: 'payment',
    user: 'Mike Wilson',
    action: 'made a payment of',
    target: '$399.99',
    time: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const pendingTasks = [
  { id: 1, task: 'Review course materials', course: 'Advanced React', due: 'Today', priority: 'high' },
  { id: 2, task: 'Grade pending submissions', course: 'JavaScript Basics', due: 'Tomorrow', priority: 'medium' },
  { id: 3, task: 'Approve study plans', course: 'Data Science', due: 'In 3 days', priority: 'low' },
  { id: 4, task: 'Update curriculum', course: 'UI/UX Design', due: 'Next week', priority: 'medium' },
];

const CoordinatorDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalStudents: 845,
    activeCourses: 24,
    pendingAssignments: 156,
    monthlyRevenue: 28950,
    studentGrowth: 12.5,
    revenueGrowth: 8.3,
  });

  const COLORS = ['#667EEA', '#F8B042', '#48BB78', '#F56565', '#9F7AEA'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
    <StyledCard
      gradient={`linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`}
      pattern={backgrounds.pattern2}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            {icon}
          </Avatar>
          <Chip
            icon={trend === 'up' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            label={`${trendValue}%`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        </Box>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
          {typeof value === 'number' && value > 1000 ? `$${value.toLocaleString()}` : value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          {title}
        </Typography>
      </CardContent>
    </StyledCard>
  );

  return (
    <Container maxWidth="xl">
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your learning platform today.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<PeopleIcon />}
            trend="up"
            trendValue={stats.studentGrowth}
            color="#667EEA"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Courses"
            value={stats.activeCourses}
            icon={<SchoolIcon />}
            trend="up"
            trendValue={5.2}
            color="#F8B042"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            icon={<AssignmentIcon />}
            trend="down"
            trendValue={3.1}
            color="#48BB78"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            icon={<MoneyIcon />}
            trend="up"
            trendValue={stats.revenueGrowth}
            color="#F56565"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Enrollment Overview
              </Typography>
              <Button
                size="small"
                endIcon={<ViewIcon />}
                onClick={() => navigate('/reports')}
              >
                View Details
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="enrollments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667EEA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667EEA" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="completions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#48BB78" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#667EEA"
                  fillOpacity={1}
                  fill="url(#enrollments)"
                  name="Enrollments"
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="#48BB78"
                  fillOpacity={1}
                  fill="url(#completions)"
                  name="Completions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Course Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={coursePerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="students"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {coursePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {coursePerformance.map((course, index) => (
                <Box key={course.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: COLORS[index],
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {course.students} students
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue Chart and Pending Tasks */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Revenue Trend
              </Typography>
              <Chip
                icon={<TrendingUpIcon />}
                label="+15.3% vs last month"
                color="success"
                size="small"
              />
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#667EEA" radius={[4, 4, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Pending Tasks
            </Typography>
            <List>
              {pendingTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getPriorityColor(task.priority)}.light` }}>
                        {task.priority === 'high' ? <WarningIcon /> :
                         task.priority === 'medium' ? <ScheduleIcon /> :
                         <CheckCircleIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.task}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {task.course}
                          </Typography>
                          <Chip
                            label={task.due}
                            size="small"
                            color={getPriorityColor(task.priority)}
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < pendingTasks.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/assignments')}
            >
              View All Tasks
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Activities
        </Typography>
        <List>
          {recentActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={activity.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
                        {activity.user}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                        {activity.target}
                      </Typography>
                    </Box>
                  }
                  secondary={activity.time}
                />
                <Chip
                  size="small"
                  label={activity.type}
                  sx={{
                    bgcolor:
                      activity.type === 'enrollment' ? '#667EEA20' :
                      activity.type === 'submission' ? '#F8B04220' :
                      activity.type === 'grade' ? '#48BB7820' : '#F5656520',
                    color:
                      activity.type === 'enrollment' ? '#667EEA' :
                      activity.type === 'submission' ? '#F8B042' :
                      activity.type === 'grade' ? '#48BB78' : '#F56565',
                    fontWeight: 600,
                  }}
                />
              </ListItem>
              {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/courses/create')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 4,
          }}
        >
          Create New Course
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/users')}
        >
          Manage Users
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/reports')}
        >
          Generate Reports
        </Button>
      </Box>
    </Container>
  );
};

export default CoordinatorDashboard;