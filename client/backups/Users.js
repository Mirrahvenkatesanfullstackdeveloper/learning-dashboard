import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Pagination,
  Alert,
  Badge,            // Added missing Badge
  Divider,          // Added missing Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Message as MessageIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import UsersTable from '../../components/Tables/UsersTable';

const Users = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const usersPerPage = 12;

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Coordinator',
      email: 'coordinator@example.com',
      role: 'coordinator',
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      isActive: true,
      isEmailVerified: true,
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 0,
      teachingCourses: 5,
      completedCourses: 0,
      bio: 'Experienced education coordinator',
      location: 'New York, NY',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Educator',
      email: 'educator@example.com',
      role: 'educator',
      profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
      isActive: true,
      isEmailVerified: true,
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 0,
      teachingCourses: 3,
      completedCourses: 0,
      bio: 'Passionate educator specializing in web development',
      location: 'San Francisco, CA',
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Learner',
      email: 'learner@example.com',
      role: 'learner',
      profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
      isActive: true,
      isEmailVerified: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 4,
      teachingCourses: 0,
      completedCourses: 2,
      averageGrade: 87,
      bio: 'Eager to learn full-stack development',
      location: 'Austin, TX',
    },
    {
      id: 4,
      firstName: 'Alice',
      lastName: 'Student',
      email: 'student@example.com',
      role: 'learner',
      profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
      isActive: true,
      isEmailVerified: true,
      lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 3,
      teachingCourses: 0,
      completedCourses: 1,
      averageGrade: 92,
      bio: 'Computer science student',
      location: 'Seattle, WA',
    },
    {
      id: 5,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      role: 'educator',
      profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
      isActive: true,
      isEmailVerified: true,
      lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 0,
      teachingCourses: 4,
      completedCourses: 0,
      bio: 'Data science instructor',
      location: 'Boston, MA',
    },
    {
      id: 6,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      role: 'learner',
      profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
      isActive: false,
      isEmailVerified: true,
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 2,
      teachingCourses: 0,
      completedCourses: 0,
      averageGrade: 78,
      bio: 'Learning UI/UX design',
      location: 'Chicago, IL',
    },
    {
      id: 7,
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      role: 'educator',
      profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
      isActive: true,
      isEmailVerified: false,
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 0,
      teachingCourses: 2,
      completedCourses: 0,
      bio: 'DevOps engineer and instructor',
      location: 'Denver, CO',
    },
    {
      id: 8,
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily.brown@example.com',
      role: 'coordinator',
      profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
      isActive: true,
      isEmailVerified: true,
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledCourses: 0,
      teachingCourses: 6,
      completedCourses: 0,
      bio: 'Program coordinator',
      location: 'Los Angeles, CA',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => 
        statusFilter === 'active' ? u.isActive : !u.isActive
      );
    }

    setFilteredUsers(filtered);
    setPage(1);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user) => {
    console.log('Toggle status for:', user);
    handleMenuClose();
  };

  const handleSendMessage = (user) => {
    console.log('Send message to:', user);
    handleMenuClose();
  };

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user);
    handleMenuClose();
  };

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleColor = (role) => {
    switch (role) {
      case 'coordinator': return 'error';
      case 'educator': return 'warning';
      case 'learner': return 'info';
      default: return 'default';
    }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/users/create')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Add User
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage users, roles, and permissions
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {users.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {users.filter(u => u.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {users.filter(u => u.role === 'educator').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Educators
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {users.filter(u => u.role === 'learner').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Learners
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
              placeholder="Search users..."
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
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="coordinator">Coordinators</MenuItem>
                <MenuItem value="educator">Educators</MenuItem>
                <MenuItem value="learner">Learners</MenuItem>
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
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('table')}
                fullWidth
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('grid')}
                fullWidth
              >
                Grid
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Display */}
      {viewMode === 'table' ? (
        <UsersTable
          users={paginatedUsers}
          onEdit={(user) => navigate(`/users/${user.id}/edit`)}
          onToggleStatus={handleToggleStatus}
          onMessage={handleSendMessage}
          onView={(user) => navigate(`/users/${user.id}`)}
        />
      ) : (
        <Grid container spacing={3}>
          {paginatedUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                  },
                }}
                onClick={() => navigate(`/users/${user.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: user.isActive ? '#48BB78' : '#A0AEC0',
                            border: '2px solid white',
                          }}
                        />
                      }
                    >
                      <Avatar
                        src={user.profilePicture}
                        sx={{ width: 80, height: 80, mb: 1 }}
                      />
                    </Badge>
                    <Typography variant="h6" align="center">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {user.email}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role)}
                      sx={{ mt: 1, textTransform: 'capitalize' }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <SchoolIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {user.enrolledCourses || user.teachingCourses}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.role === 'learner' ? 'Enrolled' : 'Teaching'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AssignmentIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {user.completedCourses || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Completed
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {user.averageGrade && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <StarIcon sx={{ color: '#F8B042', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{user.averageGrade}%</Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary" display="block" align="center" sx={{ mt: 1 }}>
                    Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Tooltip title="Send Message">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(user);
                      }}
                    >
                      <MessageIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit User">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/users/${user.id}/edit`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      color={user.isActive ? 'error' : 'success'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(user);
                      }}
                    >
                      {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/users/${selectedUser?.id}`);
          handleMenuClose();
        }}>
          <SchoolIcon fontSize="small" sx={{ mr: 1 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/users/${selectedUser?.id}/edit`);
          handleMenuClose();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit User
        </MenuItem>
        <MenuItem onClick={() => handleSendMessage(selectedUser)}>
          <MessageIcon fontSize="small" sx={{ mr: 1 }} /> Send Message
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(selectedUser)}>
          {selectedUser?.isActive ? (
            <>
              <BlockIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
              <span style={{ color: '#F56565' }}>Deactivate</span>
            </>
          ) : (
            <>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
              <span style={{ color: '#48BB78' }}>Activate</span>
            </>
          )}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteUser(selectedUser)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete User
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Users;