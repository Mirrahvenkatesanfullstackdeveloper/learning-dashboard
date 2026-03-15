import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CreateStudyPlan from './CreateStudyPlan';

const EditStudyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch study plan data
    setLoading(true);
    setTimeout(() => {
      // Mock study plan data for editing
      setPlan({
        title: 'Full Stack Developer Path',
        description: 'Complete roadmap to become a full-stack developer in 3 months',
        goal: 'Become a Full Stack Developer',
        difficulty: 'intermediate',
        weeklyHours: 15,
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isPublic: true,
        tags: ['web-development', 'full-stack'],
        courses: [1, 2, 3, 4, 5, 6], // Course IDs
        milestones: [
          {
            id: 1,
            title: 'Frontend Basics',
            description: 'Complete HTML, CSS, and JavaScript courses',
            targetDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            id: 2,
            title: 'React Mastery',
            description: 'Finish React.js Masterclass',
            targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="text" height={60} />
          <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/study-plans/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Plan
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Edit Study Plan
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <CreateStudyPlan initialData={plan} isEdit={true} planId={id} />
      </Paper>
    </Container>
  );
};

export default EditStudyPlan;