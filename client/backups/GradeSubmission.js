import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  TextField,
  Slider,
  Rating,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';

const GradeSubmission = () => {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [rubricScores, setRubricScores] = useState({});

  // Mock submission data
  const mockSubmission = {
    id: 1,
    student: {
      id: 101,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    assignment: {
      id: 1,
      title: 'React Hooks Assignment',
      description: 'Implement custom hooks and demonstrate their usage',
      totalPoints: 100,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      rubric: [
        {
          id: 1,
          criteria: 'Code Quality',
          description: 'Code is clean, well-organized, and follows best practices',
          weight: 30,
          maxScore: 30,
          levels: [
            { points: 30, description: 'Excellent code structure' },
            { points: 22, description: 'Good organization with minor issues' },
            { points: 15, description: 'Acceptable but could be improved' },
          ],
        },
        {
          id: 2,
          criteria: 'Functionality',
          description: 'All hooks work as expected with proper error handling',
          weight: 40,
          maxScore: 40,
          levels: [
            { points: 40, description: 'All features working perfectly' },
            { points: 30, description: 'Most features work with minor bugs' },
            { points: 20, description: 'Basic functionality working' },
          ],
        },
        {
          id: 3,
          criteria: 'Documentation',
          description: 'Clear documentation and examples provided',
          weight: 30,
          maxScore: 30,
          levels: [
            { points: 30, description: 'Comprehensive documentation' },
            { points: 22, description: 'Good documentation' },
            { points: 15, description: 'Basic documentation' },
          ],
        },
      ],
    },
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    files: [
      { name: 'submission.zip', size: 2500000, url: '#' },
      { name: 'README.md', size: 4500, url: '#' },
      { name: 'src/components/CustomHooks.js', size: 12000, url: '#' },
    ],
    comments: 'Here is my submission for the React Hooks assignment. I have implemented three custom hooks: useForm, useLocalStorage, and useFetch. The code is well-documented and includes error handling.',
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setSubmission(mockSubmission);
      setScore(mockSubmission.assignment.totalPoints / 2);
      setLoading(false);
    }, 1000);
  }, [id, submissionId]);

  const handleRubricChange = (criterionId, value) => {
    setRubricScores(prev => ({ ...prev, [criterionId]: value }));
    
    // Calculate total score
    const total = Object.entries(rubricScores).reduce((sum, [id, val]) => {
      const criterion = submission.assignment.rubric.find(c => c.id === parseInt(id));
      return sum + val;
    }, 0) + value;
    
    setScore(total);
  };

  const handleSubmit = () => {
    console.log('Submitting grade:', {
      submissionId,
      score,
      feedback,
      rubricScores,
    });
    // API call would go here
    navigate(`/assignments/${id}/submissions`);
  };

  const getScorePercentage = () => {
    return (score / submission?.assignment.totalPoints) * 100;
  };

  const getLetterGrade = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
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
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/assignments" color="inherit">
            Assignments
          </Link>
          <Link component={RouterLink} to={`/assignments/${id}`} color="inherit">
            {submission?.assignment.title}
          </Link>
          <Link component={RouterLink} to={`/assignments/${id}/submissions`} color="inherit">
            Submissions
          </Link>
          <Typography color="text.primary">
            Grade Submission
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/assignments/${id}/submissions`)}
          sx={{ mb: 2 }}
        >
          Back to Submissions
        </Button>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Grade Submission
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Grading Area */}
        <Grid item xs={12} md={8}>
          {/* Student Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={submission?.student.profilePicture}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {submission?.student.firstName} {submission?.student.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {submission?.student.email}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="caption">
                    Submitted {format(new Date(submission?.submittedAt), 'MMMM dd, yyyy h:mm a')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Rubric Grading */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grading Rubric
            </Typography>
            {submission?.assignment.rubric.map((criterion) => (
              <Box key={criterion.id} sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {criterion.criteria} ({criterion.weight}%)
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {criterion.description}
                </Typography>
                
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={rubricScores[criterion.id] || 0}
                    onChange={(e, val) => handleRubricChange(criterion.id, val)}
                    step={1}
                    marks={criterion.levels.map((level, index) => ({
                      value: level.points,
                      label: level.points.toString(),
                    }))}
                    min={0}
                    max={criterion.maxScore}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  {criterion.levels.map((level, index) => (
                    <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" display="block">
                        {level.points} pts
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {level.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Feedback */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Feedback
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide detailed feedback to the student..."
            />
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Score Card */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#F7F9FC' }}>
            <Typography variant="h6" gutterBottom align="center">
              Grade Summary
            </Typography>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                {score}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                out of {submission?.assignment.totalPoints} points
              </Typography>
              <Chip
                label={`${getScorePercentage().toFixed(1)}% - ${getLetterGrade()}`}
                color={getScorePercentage() >= 70 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={getScorePercentage()}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 2,
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Points
                </Typography>
                <Typography variant="h6">
                  {submission?.assignment.totalPoints}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Passing Points
                </Typography>
                <Typography variant="h6">
                  {submission?.assignment.totalPoints * 0.7}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Submitted Files */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Submitted Files
            </Typography>
            {submission?.files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  '&:hover': { bgcolor: '#F7F9FC' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachFileIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2">{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" href={file.url}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>

          {/* Student Comments */}
          {submission?.comments && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Student Comments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {submission.comments}
              </Typography>
            </Paper>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(`/assignments/${id}/submissions`)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Submit Grade
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GradeSubmission;