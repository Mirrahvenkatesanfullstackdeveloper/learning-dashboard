import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Rating,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { subDays, subMonths, format } from 'date-fns';

// Mock analytics data
const dailyActiveUsers = [
  { date: 'Mon', users: 450 },
  { date: 'Tue', users: 520 },
  { date: 'Wed', users: 580 },
  { date: 'Thu', users: 610 },
  { date: 'Fri', users: 590 },
  { date: 'Sat', users: 380 },
  { date: 'Sun', users: 290 },
];

const userAcquisition = [
  { source: 'Organic Search', users: 1240, percentage: 35 },
  { source: 'Direct', users: 890, percentage: 25 },
  { source: 'Social Media', users: 710, percentage: 20 },
  { source: 'Email', users: 530, percentage: 15 },
  { source: 'Referrals', users: 180, percentage: 5 },
];

const engagementMetrics = [
  { metric: 'Avg. Session Duration', value: '24 min', change: '+12%' },
  { metric: 'Pages per Session', value: '8.5', change: '+5%' },
  { metric: 'Bounce Rate', value: '32%', change: '-8%' },
  { metric: 'Returning Users', value: '65%', change: '+15%' },
];

const courseEngagement = [
  { course: 'Web Development', views: 3450, completions: 890, time: 45 },
  { course: 'Data Science', views: 2890, completions: 670, time: 52 },
  { course: 'UI/UX Design', views: 2100, completions: 520, time: 38 },
  { course: 'Mobile Dev', views: 1650, completions: 380, time: 41 },
  { course: 'DevOps', views: 1200, completions: 290, time: 35 },
];

const userSegments = [
  { segment: 'New Users', count: 450, color: '#667EEA' },
  { segment: 'Active Learners', count: 890, color: '#48BB78' },
  { segment: 'At Risk', count: 230, color: '#F56565' },
  { segment: 'Dormant', count: 180, color: '#A0AEC0' },
];

const COLORS = ['#667EEA', '#48BB78', '#F8B042', '#F56565', '#9F7AEA'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Advanced Analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </Box>
            </LocalizationProvider>
            <Tooltip title="Refresh Data">
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Analytics">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Deep insights into user behavior and platform performance
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#667EEA20', color: '#667EEA', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h4">2,847</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: '#48BB78', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  +12.5% vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#48BB7820', color: '#48BB78', mr: 2 }}>
                  <SpeedIcon />
                </Avatar>
                <Typography variant="h4">1,890</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Users (DAU)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: '#48BB78', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  +8.3% vs yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#F8B04220', color: '#F8B042', mr: 2 }}>
                  <TimeIcon />
                </Avatar>
                <Typography variant="h4">24m</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Avg. Session Duration
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: '#48BB78', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  +5.2% vs last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#F5656520', color: '#F56565', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="h4">32%</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Bounce Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDownIcon sx={{ color: '#48BB78', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  -3.1% improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Active Users (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyActiveUsers}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667EEA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667EEA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#718096" />
                <YAxis stroke="#718096" />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#667EEA"
                  fillOpacity={1}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Acquisition Sources
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userAcquisition}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="users"
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                >
                  {userAcquisition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Engagement Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="course" stroke="#718096" />
                <YAxis yAxisId="left" stroke="#718096" />
                <YAxis yAxisId="right" orientation="right" stroke="#718096" />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="views" fill="#667EEA" name="Views" />
                <Bar yAxisId="right" dataKey="completions" fill="#48BB78" name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Segments
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                >
                  {userSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Engagement Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {engagementMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {metric.metric}
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {metric.value}
                </Typography>
                <Chip
                  size="small"
                  label={metric.change}
                  color={metric.change.startsWith('+') ? 'success' : 'error'}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Course Engagement Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Detailed Course Analytics
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell align="right">Views</TableCell>
                <TableCell align="right">Unique Visitors</TableCell>
                <TableCell align="right">Completions</TableCell>
                <TableCell align="right">Conversion Rate</TableCell>
                <TableCell align="right">Avg. Time (min)</TableCell>
                <TableCell align="right">Engagement Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseEngagement.map((row) => (
                <TableRow key={row.course}>
                  <TableCell>{row.course}</TableCell>
                  <TableCell align="right">{row.views.toLocaleString()}</TableCell>
                  <TableCell align="right">{(row.views * 0.7).toFixed(0)}</TableCell>
                  <TableCell align="right">{row.completions}</TableCell>
                  <TableCell align="right">
                    {((row.completions / row.views) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                  <TableCell align="right">
                    <Rating
                      value={row.time / 10}
                      readOnly
                      size="small"
                      max={5}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Analytics;