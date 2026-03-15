import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Rating,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  DateRange as DateRangeIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Image as ImageIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
} from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Mock report data
const enrollmentData = [
  { month: 'Jan', enrollments: 450, completions: 320, revenue: 45000 },
  { month: 'Feb', enrollments: 520, completions: 380, revenue: 52000 },
  { month: 'Mar', enrollments: 580, completions: 420, revenue: 58000 },
  { month: 'Apr', enrollments: 610, completions: 450, revenue: 61000 },
  { month: 'May', enrollments: 670, completions: 490, revenue: 67000 },
  { month: 'Jun', enrollments: 720, completions: 530, revenue: 72000 },
];

const coursePerformance = [
  { name: 'Web Development', students: 245, completion: 78, avgGrade: 85, revenue: 98000 },
  { name: 'Data Science', students: 180, completion: 82, avgGrade: 88, revenue: 72000 },
  { name: 'UI/UX Design', students: 120, completion: 71, avgGrade: 82, revenue: 48000 },
  { name: 'Mobile Development', students: 95, completion: 65, avgGrade: 79, revenue: 38000 },
  { name: 'DevOps', students: 75, completion: 88, avgGrade: 91, revenue: 30000 },
];

const studentPerformance = [
  { name: 'Alice Johnson', courses: 4, avgGrade: 92, completion: 85, assignments: 28 },
  { name: 'Bob Smith', courses: 3, avgGrade: 88, completion: 70, assignments: 22 },
  { name: 'Carol White', courses: 5, avgGrade: 95, completion: 90, assignments: 35 },
  { name: 'David Brown', courses: 2, avgGrade: 76, completion: 50, assignments: 15 },
  { name: 'Emma Davis', courses: 4, avgGrade: 89, completion: 75, assignments: 25 },
];

const revenueData = [
  { month: 'Jan', subscriptions: 35000, oneTime: 10000, total: 45000 },
  { month: 'Feb', subscriptions: 40000, oneTime: 12000, total: 52000 },
  { month: 'Mar', subscriptions: 45000, oneTime: 13000, total: 58000 },
  { month: 'Apr', subscriptions: 47000, oneTime: 14000, total: 61000 },
  { month: 'May', subscriptions: 52000, oneTime: 15000, total: 67000 },
  { month: 'Jun', subscriptions: 55000, oneTime: 17000, total: 72000 },
];

const COLORS = ['#667EEA', '#F8B042', '#48BB78', '#F56565', '#9F7AEA'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });
  const [reportType, setReportType] = useState('summary');
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleExport = () => {
    console.log(`Exporting as ${exportFormat}...`);
    // Implement export logic
  };

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: '$387,500',
      change: '+15.3%',
      trend: 'up',
      icon: <MoneyIcon />,
      color: '#667EEA',
    },
    {
      title: 'Total Students',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: <PeopleIcon />,
      color: '#48BB78',
    },
    {
      title: 'Course Completion',
      value: '76%',
      change: '+5.1%',
      trend: 'up',
      icon: <SchoolIcon />,
      color: '#F8B042',
    },
    {
      title: 'Avg. Grade',
      value: '85%',
      change: '-2.3%',
      trend: 'down',
      icon: <AssessmentIcon />,
      color: '#F56565',
    },
  ];

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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and export comprehensive reports
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="summary">Executive Summary</MenuItem>
                <MenuItem value="enrollment">Enrollment Report</MenuItem>
                <MenuItem value="financial">Financial Report</MenuItem>
                <MenuItem value="performance">Performance Report</MenuItem>
                <MenuItem value="completion">Completion Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                  renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                />
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                  renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Format</InputLabel>
                <Select
                  value={exportFormat}
                  label="Format"
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: card.color, width: 48, height: 48 }}>
                    {card.icon}
                  </Avatar>
                  <Chip
                    icon={card.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={card.change}
                    size="small"
                    color={card.trend === 'up' ? 'success' : 'error'}
                  />
                </Box>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<BarChartIcon />} label="Overview" />
          <Tab icon={<LineChartIcon />} label="Enrollment Trends" />
          <Tab icon={<PieChartIcon />} label="Course Performance" />
          <Tab icon={<AssessmentIcon />} label="Student Performance" />
          <Tab icon={<MoneyIcon />} label="Revenue Analytics" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enrollment & Revenue Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#718096" />
                    <YAxis yAxisId="left" stroke="#718096" />
                    <YAxis yAxisId="right" orientation="right" stroke="#718096" />
                    <RechartsTooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#667EEA"
                      fill="#667EEA"
                      fillOpacity={0.3}
                      name="Enrollments"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#48BB78"
                      fill="#48BB78"
                      fillOpacity={0.3}
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Course Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={coursePerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="students"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {coursePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Metrics Summary
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Current Period</TableCell>
                        <TableCell align="right">Previous Period</TableCell>
                        <TableCell align="right">Change</TableCell>
                        <TableCell align="right">Target</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Enrollments</TableCell>
                        <TableCell align="right">2,847</TableCell>
                        <TableCell align="right">2,512</TableCell>
                        <TableCell align="right" sx={{ color: '#48BB78' }}>+13.3%</TableCell>
                        <TableCell align="right">3,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Course Completions</TableCell>
                        <TableCell align="right">1,892</TableCell>
                        <TableCell align="right">1,645</TableCell>
                        <TableCell align="right" sx={{ color: '#48BB78' }}>+15.0%</TableCell>
                        <TableCell align="right">2,100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average Grade</TableCell>
                        <TableCell align="right">85%</TableCell>
                        <TableCell align="right">87%</TableCell>
                        <TableCell align="right" sx={{ color: '#F56565' }}>-2.3%</TableCell>
                        <TableCell align="right">90%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Revenue</TableCell>
                        <TableCell align="right">$387,500</TableCell>
                        <TableCell align="right">$335,200</TableCell>
                        <TableCell align="right" sx={{ color: '#48BB78' }}>+15.6%</TableCell>
                        <TableCell align="right">$450,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Enrollment Trends Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enrollment Trends
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#667EEA"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completions"
                      stroke="#48BB78"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enrollment by Course Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={coursePerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="students"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {coursePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enrollment Statistics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Enrollments</TableCell>
                        <TableCell align="right">Completions</TableCell>
                        <TableCell align="right">Completion Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enrollmentData.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell align="right">{row.enrollments}</TableCell>
                          <TableCell align="right">{row.completions}</TableCell>
                          <TableCell align="right">
                            {((row.completions / row.enrollments) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Course Performance Tab */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Course Performance Metrics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell align="right">Students</TableCell>
                        <TableCell align="right">Completion %</TableCell>
                        <TableCell align="right">Avg. Grade</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coursePerformance.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell align="right">{row.students}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 80, mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={row.completion}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                              {row.completion}%
                            </Box>
                          </TableCell>
                          <TableCell align="right">{row.avgGrade}%</TableCell>
                          <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Rating value={row.avgGrade / 20} readOnly size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Average Grade by Course
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coursePerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#718096" />
                    <YAxis stroke="#718096" domain={[0, 100]} />
                    <RechartsTooltip />
                    <Bar dataKey="avgGrade" fill="#667EEA" radius={[4, 4, 0, 0]}>
                      {coursePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue by Course
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={coursePerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="revenue"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {coursePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Student Performance Tab */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Performing Students
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell align="center">Courses</TableCell>
                        <TableCell align="center">Assignments</TableCell>
                        <TableCell align="center">Avg. Grade</TableCell>
                        <TableCell align="center">Completion</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentPerformance.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                {row.name.charAt(0)}
                              </Avatar>
                              {row.name}
                            </Box>
                          </TableCell>
                          <TableCell align="center">{row.courses}</TableCell>
                          <TableCell align="center">{row.assignments}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${row.avgGrade}%`}
                              size="small"
                              color={row.avgGrade >= 90 ? 'success' : row.avgGrade >= 80 ? 'primary' : 'warning'}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Box sx={{ width: 60, mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={row.completion}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              {row.completion}%
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.completion >= 70 ? 'Active' : 'At Risk'}
                              size="small"
                              color={row.completion >= 70 ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { range: '90-100%', count: 45 },
                      { range: '80-89%', count: 78 },
                      { range: '70-79%', count: 52 },
                      { range: '60-69%', count: 28 },
                      { range: 'Below 60%', count: 12 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="range" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#667EEA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Student Engagement
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { week: 'Week 1', active: 450, assignments: 320 },
                      { week: 'Week 2', active: 520, assignments: 410 },
                      { week: 'Week 3', active: 580, assignments: 490 },
                      { week: 'Week 4', active: 610, assignments: 530 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="week" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#667EEA" name="Active Students" />
                    <Line type="monotone" dataKey="assignments" stroke="#48BB78" name="Assignments" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Revenue Analytics Tab */}
        {tabValue === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="subscriptions" stackId="a" fill="#667EEA" name="Subscriptions" />
                    <Bar dataKey="oneTime" stackId="a" fill="#48BB78" name="One-time Payments" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={coursePerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="revenue"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {coursePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Revenue Growth
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#667EEA"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Summary
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Subscriptions</TableCell>
                        <TableCell align="right">One-time</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Growth</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueData.map((row, index) => {
                        const prevTotal = index > 0 ? revenueData[index - 1].total : row.total;
                        const growth = ((row.total - prevTotal) / prevTotal * 100).toFixed(1);
                        return (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell align="right">${row.subscriptions.toLocaleString()}</TableCell>
                            <TableCell align="right">${row.oneTime.toLocaleString()}</TableCell>
                            <TableCell align="right">${row.total.toLocaleString()}</TableCell>
                            <TableCell align="right">
                              <Chip
                                size="small"
                                label={`${growth}%`}
                                color={parseFloat(growth) >= 0 ? 'success' : 'error'}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Export Options */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export Options
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={() => setExportFormat('pdf')}
              sx={{
                borderColor: exportFormat === 'pdf' ? '#667EEA' : undefined,
                bgcolor: exportFormat === 'pdf' ? 'rgba(102, 126, 234, 0.1)' : undefined,
              }}
            >
              PDF Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ExcelIcon />}
              onClick={() => setExportFormat('excel')}
              sx={{
                borderColor: exportFormat === 'excel' ? '#667EEA' : undefined,
                bgcolor: exportFormat === 'excel' ? 'rgba(102, 126, 234, 0.1)' : undefined,
              }}
            >
              Excel Export
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={() => setExportFormat('image')}
              sx={{
                borderColor: exportFormat === 'image' ? '#667EEA' : undefined,
                bgcolor: exportFormat === 'image' ? 'rgba(102, 126, 234, 0.1)' : undefined,
              }}
            >
              Charts as Images
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Reports;