import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Menu,
  Tooltip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Pagination,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  Archive as ArchiveIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format, isAfter, isBefore, addDays } from 'date-fns';

// Mock assignments data
const mockAssignments = [
  {
    id: 1,
    title: 'React Hooks Assignment',
    description: 'Implement custom hooks and demonstrate their usage',
    course: {
      id: 1,
      title: 'Full Stack Web Development',
      instructor: 'Dr. Jane Smith',
    },
    type: 'assignment',
    totalPoints: 100,
    dueDate: addDays(new Date(), 2).toISOString(),
    availableFrom: new Date().toISOString(),
    submissions: {
      total: 45,
      submitted: 23,
      graded: 12,
      pending: 11,
    },
    status: 'active',
    priority: 'high',
    createdBy: 'Dr. Jane Smith',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Database Design Quiz',
    description: 'Test your knowledge of normalization and SQL',
    course: {
      id: 3,
      title: 'Database Design Fundamentals',
      instructor: 'Dr. Emily Brown',
    },
    type: 'quiz',
    totalPoints: 50,
    dueDate: addDays(new Date(), 5).toISOString(),
    availableFrom: new Date().toISOString(),
    submissions: {
      total: 67,
      submitted: 34,
      graded: 28,
      pending: 6,
    },
    status: 'active',
    priority: 'medium',
    createdBy: 'Dr. Emily Brown',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Final Project Proposal',
    description: 'Submit your final project proposal for approval',
    course: {
      id: 1,
      title: 'Full Stack Web Development',
      instructor: 'Dr. Jane Smith',
    },
    type: 'project',
    totalPoints: 150,
    dueDate: addDays(new Date(), 10).toISOString(),
    availableFrom: new Date().toISOString(),
    submissions: {
      total: 45,
      submitted: 12,
      graded: 5,
      pending: 7,
    },
    status: 'active',
    priority: 'high',
    createdBy: 'Dr. Jane Smith',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your JavaScript knowledge',
    course: {
      id: 1,
      title: 'Full Stack Web Development',
      instructor: 'Dr. Jane Smith',
    },
    type: 'quiz',
    totalPoints: 30,
    dueDate: addDays(new Date(), -2).toISOString(),
    availableFrom: addDays(new Date(), -7).toISOString(),
    submissions: {
      total: 45,
      submitted: 38,
      graded: 35,
      pending: 3,
    },
    status: 'past',
    priority: 'low',
    createdBy: 'Dr. Jane Smith',
    createdAt: addDays(new Date(), -7).toISOString(),
  },
  {
    id: 5,
    title: 'REST API Design',
    description: 'Design a RESTful API for a blogging platform',
    course: {
      id: 2,
      title: 'Advanced React Patterns',
      instructor: 'Prof. John Doe',
    },
    type: 'assignment',
    totalPoints: 100,
    dueDate: addDays(new Date(), 3).toISOString(),
    availableFrom: new Date().toISOString(),
    submissions: {
      total: 89,
      submitted: 0,
      graded: 0,
      pending: 0,
    },
    status: 'upcoming',
    priority: 'medium',
    createdBy: 'Prof. John Doe',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'Authentication Implementation',
    description: 'Implement JWT authentication in Node.js',
    course: {
      id: 1,
      title: 'Full Stack Web Development',
      instructor: 'Dr. Jane Smith',
    },
    type: 'assignment',
    totalPoints: 80,
    dueDate: addDays(new Date(), -5).toISOString(),
    availableFrom: addDays(new Date(), -12).toISOString(),
    submissions: {
      total: 45,
      submitted: 42,
      graded: 40,
      pending: 2,
    },
    status: 'grading',
    priority: 'high',
    createdBy: 'Dr. Jane Smith',
    createdAt: addDays(new Date(), -12).toISOString(),
  },
];

const assignmentTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'quiz', label: 'Quizzes' },
  { value: 'project', label: 'Projects' },
  { value: 'exam', label: 'Exams' },
];

const statusColors = {
  active: 'success',
  upcoming: 'info',
  past: 'default',
  grading: 'warning',
  draft: 'secondary',
};

const Assignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [page, setPage] = useState(1);
  const assignmentsPerPage = 9;

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAssignments(mockAssignments);
      setFilteredAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, typeFilter, statusFilter, tabValue, assignments]);

  const filterAssignments = () => {
    let filtered = [...assignments];

    // Filter by tab
    if (tabValue === 0) {
      // All assignments
    } else if (tabValue === 1) {
      // Active/Upcoming
      filtered = filtered.filter(a => 
        a.status === 'active' || a.status === 'upcoming'
      );
    } else if (tabValue === 2) {
      // Past
      filtered = filtered.filter(a => a.status === 'past');
    } else if (tabValue === 3) {
      // Grading
      filtered = filtered.filter(a => a.status === 'grading');
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.course.title.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term)
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    setFilteredAssignments(filtered);
    setPage(1);
  };

  const handleMenuOpen = (event, assignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssignment(null);
  };

  const getStatusChip = (status) => {
    const config = {
      active: { label: 'Active', color: 'success' },
      upcoming: { label: 'Upcoming', color: 'info' },
      past: { label: 'Past', color: 'default' },
      grading: { label: 'Grading', color: 'warning' },
      draft: { label: 'Draft', color: 'secondary' },
    };
    const { label, color } = config[status] || { label: status, color: 'default' };
    return <Chip label={label} color={color} size="small" />;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <WarningIcon color="error" fontSize="small" />;
      case 'medium':
        return <ScheduleIcon color="warning" fontSize="small" />;
      default:
        return <CheckCircleIcon color="success" fontSize="small" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <GradeIcon />;
      case 'project':
        return <AssignmentIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  const paginatedAssignments = filteredAssignments.slice(
    (page - 1) * assignmentsPerPage,
    page * assignmentsPerPage
  );

  const totalPages = Math.ceil(filteredAssignments.length / assignmentsPerPage);

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Assignments
          </Typography>
          {(user?.role === 'educator' || user?.role === 'coordinator') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/assignments/create')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Create Assignment
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all your assignments
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Assignments" />
          <Tab
            label={
              <Badge badgeContent={assignments.filter(a => a.status === 'active' || a.status === 'upcoming').length} color="error">
                Active & Upcoming
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={assignments.filter(a => a.status === 'past').length} color="default">
                Past
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={assignments.filter(a => a.status === 'grading').length} color="warning">
                Grading
              </Badge>
            }
          />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search assignments..."
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
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {assignmentTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="past">Past</MenuItem>
                <MenuItem value="grading">Grading</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredAssignments.length} assignments found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Assignments Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : filteredAssignments.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedAssignments.map((assignment) => (
              <Grid item xs={12} md={6} lg={4} key={assignment.id}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                    },
                  }}
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {getTypeIcon(assignment.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {assignment.course.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.course.instructor}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {getStatusChip(assignment.status)}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, assignment);
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Title and Description */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {assignment.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {assignment.description}
                  </Typography>

                  {/* Metadata */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Tooltip title="Due Date">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption">
                          {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Total Points">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GradeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption">{assignment.totalPoints} pts</Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Priority">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getPriorityIcon(assignment.priority)}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {assignment.priority}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* Submission Progress */}
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Submissions</Typography>
                      <Typography variant="caption">
                        {assignment.submissions.submitted}/{assignment.submissions.total}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(assignment.submissions.submitted / assignment.submissions.total) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mb: 1,
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Chip
                        size="small"
                        label={`${assignment.submissions.graded} Graded`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${assignment.submissions.pending} Pending`}
                        variant="outlined"
                        color="warning"
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No assignments found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No assignments have been created yet'}
          </Typography>
          {(user?.role === 'educator' || user?.role === 'coordinator') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/assignments/create')}
            >
              Create First Assignment
            </Button>
          )}
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/assignments/${selectedAssignment?.id}`);
          handleMenuClose();
        }}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {(user?.role === 'educator' || user?.role === 'coordinator') && (
          [
            <MenuItem key="edit" onClick={() => {
              navigate(`/assignments/${selectedAssignment?.id}/edit`);
              handleMenuClose();
            }}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>,
            <MenuItem key="copy" onClick={handleMenuClose}>
              <CopyIcon fontSize="small" sx={{ mr: 1 }} /> Duplicate
            </MenuItem>,
            <MenuItem key="archive" onClick={handleMenuClose}>
              <ArchiveIcon fontSize="small" sx={{ mr: 1 }} /> Archive
            </MenuItem>,
            <MenuItem key="delete" onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>,
          ]
        )}
      </Menu>
    </Container>
  );
};

export default Assignments;