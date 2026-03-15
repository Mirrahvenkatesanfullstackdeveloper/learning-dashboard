import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
  Rating,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

const MySubmissions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  // Mock submissions data
  const mockSubmissions = [
    {
      id: 1,
      assignment: {
        id: 1,
        title: 'React Hooks Assignment',
        course: 'Full Stack Web Development',
        totalPoints: 100,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'graded',
      grade: {
        score: 92,
        feedback: 'Excellent work! Your hooks are well-implemented and documented.',
        gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      files: [
        { name: 'submission.zip', size: 2500000 },
      ],
    },
    {
      id: 2,
      assignment: {
        id: 2,
        title: 'Database Design Quiz',
        course: 'Database Design Fundamentals',
        totalPoints: 50,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'graded',
      grade: {
        score: 42,
        feedback: 'Good job! You missed a few questions on normalization.',
        gradedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      id: 3,
      assignment: {
        id: 3,
        title: 'REST API Design',
        course: 'Advanced React Patterns',
        totalPoints: 100,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    },
    {
      id: 4,
      assignment: {
        id: 4,
        title: 'JavaScript Fundamentals Quiz',
        course: 'Full Stack Web Development',
        totalPoints: 30,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'late',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded': return 'success';
      case 'pending': return 'warning';
      case 'late': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded': return <CheckCircleIcon />;
      case 'pending': return <ScheduleIcon />;
      case 'late': return <WarningIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const calculateAverage = () => {
    const graded = submissions.filter(s => s.status === 'graded');
    if (graded.length === 0) return 0;
    const total = graded.reduce((sum, s) => sum + s.grade.score, 0);
    return Math.round(total / graded.length);
  };

  const stats = {
    total: submissions.length,
    graded: submissions.filter(s => s.status === 'graded').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    late: submissions.filter(s => s.status === 'late').length,
    average: calculateAverage(),
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          My Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all your assignment submissions and grades
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Submissions
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {stats.graded}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Graded
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Review
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main">
              {stats.late}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Late Submissions
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Average Grade Card */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#F7F9FC' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                {stats.average}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Average Grade
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Performance Rating:
              </Typography>
              <Rating value={stats.average / 20} readOnly precision={0.5} />
              <Chip
                label={stats.average >= 90 ? 'Excellent' : stats.average >= 70 ? 'Good' : 'Needs Improvement'}
                color={stats.average >= 90 ? 'success' : stats.average >= 70 ? 'primary' : 'warning'}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Submissions List */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Submission History
      </Typography>

      <Grid container spacing={3}>
        {submissions.map((submission) => (
          <Grid item xs={12} key={submission.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(8px)',
                  boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
                },
              }}
              onClick={() => navigate(`/assignments/${submission.assignment.id}`)}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${getStatusColor(submission.status)}.light` }}>
                        {getStatusIcon(submission.status)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {submission.assignment.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {submission.assignment.course}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                          <Chip
                            size="small"
                            label={`Due: ${format(new Date(submission.assignment.dueDate), 'MMM dd, yyyy')}`}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`Submitted: ${format(new Date(submission.submittedAt), 'MMM dd, yyyy')}`}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`Status: ${submission.status}`}
                            color={getStatusColor(submission.status)}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {submission.status === 'graded' ? (
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                          {submission.grade.score}/{submission.assignment.totalPoints}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Grade: {((submission.grade.score / submission.assignment.totalPoints) * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Graded {format(new Date(submission.grade.gradedAt), 'MMM dd')}
                        </Typography>
                        {submission.grade.feedback && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Feedback: {submission.grade.feedback}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'right' }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle resubmission
                          }}
                          startIcon={<RefreshIcon />}
                        >
                          {submission.status === 'late' ? 'Resubmit' : 'View Submission'}
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Submissions State */}
      {submissions.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No submissions yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You haven't submitted any assignments yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/assignments')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Browse Assignments
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default MySubmissions;