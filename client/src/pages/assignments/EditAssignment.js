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
import CreateAssignment from './CreateAssignment'; // Reuse the same form

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch assignment data
    setLoading(true);
    setTimeout(() => {
      // Mock assignment data for editing
      setAssignment({
        title: 'React Hooks Assignment',
        description: 'Implement custom hooks and demonstrate their usage',
        courseId: '1',
        type: 'assignment',
        totalPoints: 100,
        passingPoints: 70,
        dueDate: '2024-03-01T23:59',
        availableFrom: '2024-02-15T00:00',
        availableUntil: '2024-03-15T23:59',
        timeLimit: 120,
        attemptsAllowed: 3,
        allowLateSubmissions: true,
        latePenalty: 10,
        maxFileSize: 10485760,
        allowedFileTypes: ['.zip', '.js', '.jsx'],
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
          onClick={() => navigate(`/assignments/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Assignment
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Edit Assignment
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <CreateAssignment initialData={assignment} isEdit={true} assignmentId={id} />
      </Paper>
    </Container>
  );
};

export default EditAssignment;