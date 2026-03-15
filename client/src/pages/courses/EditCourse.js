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
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CreateCourse from './CreateCourse'; // Reuse the same form with edit mode

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch course data
    setLoading(true);
    setTimeout(() => {
      // Mock course data for editing
      setCourse({
        title: 'Full Stack Web Development Bootcamp',
        shortDescription: 'Learn MERN stack from scratch and build real-world applications',
        description: 'Comprehensive course covering React, Node.js, MongoDB, Express',
        category: 'programming',
        level: 'beginner',
        language: 'en',
        price: 499.99,
        discountedPrice: 399.99,
        prerequisites: ['Basic computer skills', 'No prior programming experience required'],
        learningObjectives: [
          'Build full-stack web applications',
          'Master React.js',
          'Create RESTful APIs',
        ],
        tags: ['react', 'node', 'mongodb'],
        thumbnail: 'thumbnail-url',
        coverImage: 'cover-image-url',
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
          onClick={() => navigate(`/courses/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Course
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Edit Course
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {/* We're reusing the CreateCourse component but passing initial data */}
        <CreateCourse initialData={course} isEdit={true} courseId={id} />
      </Paper>
    </Container>
  );
};

export default EditCourse;