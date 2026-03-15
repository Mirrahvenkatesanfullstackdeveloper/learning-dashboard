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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  Rating,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format, formatDistanceToNow } from 'date-fns';
import SubmissionModal from '../../components/Modals/SubmissionModal';
import GradeModal from '../../components/Modals/GradeModal';
import FileUpload from '../../components/Common/FileUpload';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submission, setSubmission] = useState(null);

  // Mock assignment data
  const mockAssignment = {
    id: 1,
    title: 'React Hooks Assignment',
    description: 'Implement custom hooks and demonstrate their usage in a real-world application. Create at least three custom hooks and show how they improve code reusability.',
    instructions: `
      1. Create a custom hook for form handling (useForm)
      2. Create a custom hook for local storage (useLocalStorage)
      3. Create a custom hook for API calls (useFetch)
      4. Build a small application demonstrating all three hooks
      5. Write documentation for your hooks
      6. Include proper error handling
    `,
    course: {
      id: 1,
      title: 'Full Stack Web Development Bootcamp',
      instructor: 'Dr. Jane Smith',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    },
    type: 'assignment',
    totalPoints: 100,
    passingPoints: 70,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    timeLimit: 120, // minutes
    attemptsAllowed: 3,
    allowLateSubmissions: true,
    latePenalty: 10, // percentage
    rubric: [
      {
        id: 1,
        criteria: 'Code Quality',
        description: 'Code is clean, well-organized, and follows best practices',
        weight: 30,
        levels: [
          { name: 'Excellent', points: 30, description: 'Perfect code structure' },
          { name: 'Good', points: 22, description: 'Good organization with minor issues' },
          { name: 'Satisfactory', points: 15, description: 'Acceptable but could be improved' },
          { name: 'Needs Improvement', points: 8, description: 'Poor organization' },
        ],
      },
      {
        id: 2,
        criteria: 'Functionality',
        description: 'All hooks work as expected with proper error handling',
        weight: 40,
        levels: [
          { name: 'Excellent', points: 40, description: 'All features working perfectly' },
          { name: 'Good', points: 30, description: 'Most features work with minor bugs' },
          { name: 'Satisfactory', points: 20, description: 'Basic functionality working' },
          { name: 'Needs Improvement', points: 10, description: 'Major functionality missing' },
        ],
      },
      {
        id: 3,
        criteria: 'Documentation',
        description: 'Clear documentation and examples provided',
        weight: 30,
        levels: [
          { name: 'Excellent', points: 30, description: 'Comprehensive documentation' },
          { name: 'Good', points: 22, description: 'Good documentation' },
          { name: 'Satisfactory', points: 15, description: 'Basic documentation' },
          { name: 'Needs Improvement', points: 8, description: 'Poor or missing documentation' },
        ],
      },
    ],
    attachments: [
      { name: 'assignment-template.zip', size: 2500000, url: '#' },
      { name: 'sample-implementation.js', size: 45000, url: '#' },
    ],
    allowedFileTypes: ['.zip', '.js', '.jsx', '.pdf'],
    maxFileSize: 10485760, // 10MB
    statistics: {
      totalSubmissions: 45,
      averageScore: 82,
      highestScore: 98,
      lowestScore: 45,
      passRate: 85,
    },
    submissions: [
      {
        id: 1,
        student: {
          id: 101,
          name: 'Alice Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        grade: {
          score: 92,
          feedback: 'Excellent work! Your hooks are well-implemented and documented.',
          gradedBy: 'Dr. Jane Smith',
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      {
        id: 2,
        student: {
          id: 102,
          name: 'Bob Smith',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        },
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: 3,
        student: {
          id: 103,
          name: 'Carol White',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        },
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        grade: {
          score: 78,
          feedback: 'Good effort. Some hooks could be improved.',
          gradedBy: 'Dr. Jane Smith',
          gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    ],
    comments: [
      {
        id: 1,
        user: 'Dr. Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        content: 'Remember to include error handling in your hooks!',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        user: 'Alice Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        content: 'Is there a specific format required for the documentation?',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAssignment(mockAssignment);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getTimeRemaining = () => {
    if (!assignment) return null;
    
    const now = new Date();
    const due = new Date(assignment.dueDate);
    
    if (now > due) {
      return 'Overdue';
    }
    
    return formatDistanceToNow(due, { addSuffix: true });
  };

  const getStatusColor = () => {
    const now = new Date();
    const due = new Date(assignment?.dueDate);
    const availableFrom = new Date(assignment?.availableFrom);
    
    if (now < availableFrom) return 'info';
    if (now > due) return 'error';
    return 'success';
  };

  const getStatusText = () => {
    const now = new Date();
    const due = new Date(assignment?.dueDate);
    const availableFrom = new Date(assignment?.availableFrom);
    
    if (now < availableFrom) return 'Not yet available';
    if (now > due) return 'Past due';
    return 'Active';
  };

  const handleSubmitAssignment = (data) => {
    console.log('Submitting assignment:', data);
    setSubmissionModalOpen(false);
    // Show success message
  };

  const handleGradeSubmission = (data) => {
    console.log('Grading submission:', data);
    setGradeModalOpen(false);
    // Show success message
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
          <Typography color="text.primary">{assignment?.title}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {assignment?.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<ScheduleIcon />}
                label={`Due: ${format(new Date(assignment?.dueDate), 'MMMM dd, yyyy h:mm a')}`}
                color={getStatusColor()}
                variant="outlined"
              />
              <Chip
                icon={<GradeIcon />}
                label={`${assignment?.totalPoints} points`}
                variant="outlined"
              />
              <Chip
                icon={<AssignmentIcon />}
                label={assignment?.type}
                variant="outlined"
              />
              <Chip
                label={getStatusText()}
                color={getStatusColor()}
                size="small"
              />
            </Box>
          </Box>

          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {(user?.role === 'educator' || user?.role === 'coordinator') && [
                <MenuItem key="edit" onClick={() => navigate(`/assignments/${id}/edit`)}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>,
                <MenuItem key="grade-all" onClick={() => navigate(`/assignments/${id}/submissions`)}>
                  <AssessmentIcon fontSize="small" sx={{ mr: 1 }} /> Grade All
                </MenuItem>,
                <MenuItem key="delete" sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>,
              ]}
              {user?.role === 'learner' && (
                <MenuItem onClick={() => setSubmissionModalOpen(true)}>
                  <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} /> Submit
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="Details" />
              <Tab label="Submissions" />
              <Tab label="Rubric" />
              <Tab label="Discussions" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Details Tab */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {assignment?.description}
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Instructions
                  </Typography>
                  <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {assignment?.instructions}
                  </Typography>

                  {/* Attachments */}
                  {assignment?.attachments?.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Attachments
                      </Typography>
                      <List>
                        {assignment.attachments.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AttachFileIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024).toFixed(2)} KB`}
                            />
                            <Button
                              startIcon={<DownloadIcon />}
                              size="small"
                              href={file.url}
                            >
                              Download
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Important Dates */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#F7F9FC', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Important Dates
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Available From
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(assignment?.availableFrom), 'MMM dd, yyyy h:mm a')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Due Date
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(assignment?.dueDate), 'MMM dd, yyyy h:mm a')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Time Remaining
                        </Typography>
                        <Typography variant="body2" color={getTimeRemaining() === 'Overdue' ? 'error' : 'inherit'}>
                          {getTimeRemaining()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Submissions Tab */}
              {tabValue === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">
                      Submissions ({assignment?.submissions.length})
                    </Typography>
                    {(user?.role === 'educator' || user?.role === 'coordinator') && (
                      <Button
                        variant="contained"
                        startIcon={<GradeIcon />}
                        onClick={() => navigate(`/assignments/${id}/submissions`)}
                      >
                        Grade All
                      </Button>
                    )}
                  </Box>

                  {assignment?.submissions.map((sub) => (
                    <Card key={sub.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar src={sub.student.avatar} sx={{ mr: 2 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">
                              {sub.student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Submitted {formatDistanceToNow(new Date(sub.submittedAt))} ago
                            </Typography>
                          </Box>
                          <Chip
                            label={sub.status}
                            color={sub.status === 'graded' ? 'success' : 'warning'}
                            size="small"
                            sx={{ mr: 2 }}
                          />
                          {user?.role === 'educator' || user?.role === 'coordinator' ? (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setGradeModalOpen(true)}
                            >
                              {sub.status === 'graded' ? 'View Grade' : 'Grade'}
                            </Button>
                          ) : (
                            sub.status === 'graded' && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setGradeModalOpen(true)}
                              >
                                View Feedback
                              </Button>
                            )
                          )}
                        </Box>
                        {sub.status === 'graded' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <GradeIcon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="h6" color="primary">
                                {sub.grade.score}/{assignment?.totalPoints}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Graded by {sub.grade.gradedBy}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Rubric Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Grading Rubric
                  </Typography>
                  {assignment?.rubric.map((criterion) => (
                    <Box key={criterion.id} sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {criterion.criteria} ({criterion.weight}%)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {criterion.description}
                      </Typography>
                      <List dense>
                        {criterion.levels.map((level, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color={index === 0 ? 'success' : 'inherit'} />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${level.name}: ${level.points} points`}
                              secondary={level.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Discussions Tab */}
              {tabValue === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">
                      Discussion ({assignment?.comments.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<CommentIcon />}
                      onClick={() => setSubmitDialogOpen(true)}
                    >
                      Add Comment
                    </Button>
                  </Box>

                  {assignment?.comments.map((comment) => (
                    <Box key={comment.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={comment.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </Typography>
                        </Box>
                      </Box>
                      <Paper variant="outlined" sx={{ p: 2, ml: 5, bgcolor: '#F7F9FC' }}>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Course Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={assignment?.course.thumbnail}
                variant="rounded"
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle2">
                  {assignment?.course.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Instructor: {assignment?.course.instructor}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(`/courses/${assignment?.course.id}`)}
            >
              View Course
            </Button>
          </Paper>

          {/* Statistics (for educators) */}
          {(user?.role === 'educator' || user?.role === 'coordinator') && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    {assignment?.statistics.totalSubmissions}
                  </Typography>
                  <Typography variant="caption">Total Submissions</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="success.main">
                    {assignment?.statistics.averageScore}
                  </Typography>
                  <Typography variant="caption">Average Score</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="info.main">
                    {assignment?.statistics.highestScore}
                  </Typography>
                  <Typography variant="caption">Highest Score</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="warning.main">
                    {assignment?.statistics.passRate}%
                  </Typography>
                  <Typography variant="caption">Pass Rate</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Rules & Policies */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rules & Policies
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`Attempts Allowed: ${assignment?.attemptsAllowed}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`Time Limit: ${assignment?.timeLimit} minutes`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`Late Submissions: ${assignment?.allowLateSubmissions ? 'Allowed' : 'Not Allowed'}`}
                />
              </ListItem>
              {assignment?.allowLateSubmissions && (
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Late Penalty: ${assignment?.latePenalty}% deduction`}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Submission Modal */}
      <SubmissionModal
        open={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        assignment={assignment}
        onSubmit={handleSubmitAssignment}
        mode="submit"
      />

      {/* Grade Modal */}
      <GradeModal
        open={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        submission={submission}
        rubric={assignment?.rubric}
        onGrade={handleGradeSubmission}
      />

      {/* Comment Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your comment..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSubmitDialogOpen(false)}>
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignmentDetails;