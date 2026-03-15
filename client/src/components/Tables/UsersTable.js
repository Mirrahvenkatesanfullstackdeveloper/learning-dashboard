import React from 'react';
import {
  Avatar,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import DataTable from './DataTable';
import { formatDate } from '../../utils/formatters';

const UsersTable = ({ users, onEdit, onToggleStatus, onMessage, onView }) => {
  const getRoleChip = (role) => {
    const roleConfig = {
      coordinator: { color: 'error', label: 'Coordinator' },
      educator: { color: 'warning', label: 'Educator' },
      learner: { color: 'info', label: 'Learner' },
    };

    const config = roleConfig[role] || { color: 'default', label: role };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getStatusChip = (isActive) => {
    return (
      <Chip
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'default'}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const columns = [
    {
      field: 'user',
      headerName: 'User',
      minWidth: 250,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={row.profilePicture}
            sx={{ width: 40, height: 40 }}
          >
            {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 100,
      align: 'center',
      sortable: true,
      renderCell: (row) => getRoleChip(row.role),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      align: 'center',
      sortable: true,
      renderCell: (row) => getStatusChip(row.isActive),
    },
    {
      field: 'enrolledCourses',
      headerName: 'Enrolled',
      minWidth: 100,
      align: 'center',
      renderCell: (row) => (
        <Chip
          label={row.enrolledCourses?.length || 0}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      minWidth: 120,
      sortable: true,
      renderCell: (row) => (
        <Tooltip title={formatDate(row.lastLogin, 'full')}>
          <Typography variant="body2">
            {row.lastLogin ? formatDate(row.lastLogin) : 'Never'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'joined',
      headerName: 'Joined',
      minWidth: 100,
      sortable: true,
      renderCell: (row) => formatDate(row.createdAt),
    },
    {
      field: 'emailVerified',
      headerName: 'Email Verified',
      minWidth: 120,
      align: 'center',
      renderCell: (row) => (
        <Chip
          label={row.isEmailVerified ? 'Verified' : 'Pending'}
          color={row.isEmailVerified ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
  ];

  const customActions = (row) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="Send Message">
        <IconButton size="small" color="primary" onClick={() => onMessage(row)}>
          <MessageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit User">
        <IconButton size="small" color="info" onClick={() => onEdit(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
        <Switch
          size="small"
          checked={row.isActive}
          onChange={() => onToggleStatus(row)}
          color={row.isActive ? 'success' : 'default'}
        />
      </Tooltip>
    </Box>
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      title="User Management"
      actions={true}
      selectable={true}
      customActions={customActions}
      onView={onView}
    />
  );
};

export default UsersTable;