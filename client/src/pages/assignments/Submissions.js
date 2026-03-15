import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Grade as GradeIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Assessment as AssessmentIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SubmissionsTable from '../../components/Tables/SubmissionsTable';
import SubmissionModal from '../../components/Modals/SubmissionModal';
import GradeModal from '../../components/Modals/GradeModal';

const Submissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Mock submissions data
  const mockSubmissions = [
    {
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
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'graded',
      grade: {
        score: 92,
        totalPoints: 100,
        feedback: 'Excellent work!',
      },
      files: [
        { name: 'submission.zip', size: 2500000, url: '#' },
        { name: 'README.md', size: 4500, url: '#' },
      ],
      comments: 'Here is my submission. Please let me know if any issues.',
    },
    {
      id: 2,
      student: {
        id: 102,
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      assignment: {
        id: 1,
        title: 'React Hooks Assignment',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'submitted',
      files: [
        { name: 'project.zip', size: 3200000, url: '#' },
      ],
    },
    {
      id: 3,
      student: {
        id: 103,
        firstName: 'Carol',
        lastName: 'White',
        email: 'carol@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
      },
      assignment: {
        id: 1,
        title: 'React Hooks Assignment',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'late',
      files: [
        { name: 'homework.pdf', size: 1200000, url: '#' },
      ],
      comments: 'Sorry for the delay!',
    },
    {
      id: 4,
      student: {
        id: 104,
        firstName: 'David',
        lastName: 'Brown',
        email: 'david@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
      assignment: {
        id: 1,
        title: 'React Hooks Assignment',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'graded',
      grade: {
        score: 78,
        totalPoints: 100,
        feedback: 'Good effort. Some improvements needed.',
      },
      files: [
        { name: 'assignment.pdf', size: 1800000, url: '#' },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setFilteredSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    filterSubmissions();
  }, [searchTerm, statusFilter, submissions]);

  const filterSubmissions = () => {
    let filtered = [...submissions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        `${s.student.firstName} ${s.student.lastName}`.toLowerCase().includes(term) ||
        s.student.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  };

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    setGradeModalOpen(true);
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setSubmissionModalOpen(true);
  };

  const handleDownload = (file) => {
    console.log('Downloading:', file);
    // Implement download logic
  };

  const handleGradeSubmit = (gradeData) => {
    console.log('Grade submitted:', gradeData);
    setGradeModalOpen(false);
    // Update submissions list
  };

  const getStatistics = () => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const pending = submissions.filter(s => s.status === 'submitted').length;
    const late = submissions.filter(s => s.status === 'late').length;
    const average = submissions
      .filter(s => s.grade)
      .reduce((acc, s) => acc + s.grade.score, 0) / (graded || 1);

    return { total, graded, pending, late, average: Math.round(average) };
  };

  const stats = getStatistics();

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
          Assignment Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          React Hooks Assignment - Full Stack Web Development
        </Typography>
      </Box>

      {/* Statistics Cards */}
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
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main">
              {stats.late}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Late
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="graded">Graded</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Export as CSV">
              <Button variant="outlined" startIcon={<ExportIcon />}>
                Export
              </Button>
            </Tooltip>
            <Tooltip title="Grade All Pending">
              <Button
                variant="contained"
                startIcon={<GradeIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Grade All
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Submissions Table */}
      <SubmissionsTable
        submissions={filteredSubmissions}
        onGrade={handleGrade}
        onView={handleView}
        onDownload={handleDownload}
      />

      {/* Modals */}
      <SubmissionModal
        open={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        submission={selectedSubmission}
        mode="view"
      />

      <GradeModal
        open={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        submission={selectedSubmission}
        onGrade={handleGradeSubmit}
      />
    </Container>
  );
};

export default Submissions;