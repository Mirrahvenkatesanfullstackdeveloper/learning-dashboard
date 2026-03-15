import React from 'react';
import {
  Avatar,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Link,
  Typography,  // Added missing Typography import
} from '@mui/material';
import {
  Download as DownloadIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import DataTable from './DataTable';
import { formatDate } from '../../utils/formatters';

const SubmissionsTable = ({ submissions, onGrade, onView, onDownload }) => {
  const getStatusChip = (status) => {
    const statusConfig = {
      submitted: { color: 'info', label: 'Submitted' },
      graded: { color: 'success', label: 'Graded' },
      late: { color: 'warning', label: 'Late' },
      returned: { color: 'default', label: 'Returned' },
    };

    const config = statusConfig[status] || { color: 'default', label: status };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const columns = [
    {
      field: 'student',
      headerName: 'Student',
      minWidth: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={row.student?.profilePicture}
            sx={{ width: 32, height: 32 }}
          >
            {row.student?.firstName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.student?.firstName} {row.student?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.student?.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'assignment',
      headerName: 'Assignment',
      minWidth: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.assignment?.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Due: {formatDate(row.assignment?.dueDate)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'submittedAt',
      headerName: 'Submitted',
      minWidth: 120,
      sortable: true,
      renderCell: (row) => (
        <Tooltip title={formatDate(row.submittedAt, 'full')}>
          <Typography variant="body2">
            {formatDate(row.submittedAt)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      sortable: true,
      renderCell: (row) => getStatusChip(row.status),
    },
    {
      field: 'grade',
      headerName: 'Grade',
      minWidth: 100,
      align: 'center',
      renderCell: (row) => {
        if (row.status === 'graded') {
          return (
            <Chip
              label={`${row.grade?.score}/${row.grade?.totalPoints}`}
              color="success"
              size="small"
              variant="outlined"
            />
          );
        }
        return <Chip label="Pending" size="small" variant="outlined" />;
      },
    },
    {
      field: 'files',
      headerName: 'Files',
      minWidth: 100,
      align: 'center',
      renderCell: (row) => (
        <Box>
          {row.files?.map((file, index) => (
            <Tooltip key={index} title={file.name}>
              <IconButton
                size="small"
                onClick={() => onDownload && onDownload(file)}
                sx={{ mr: 0.5 }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      ),
    },
  ];

  const actions = {
    onView,
    onEdit: onGrade ? (row) => onGrade(row) : undefined,
    editIcon: <GradeIcon />,
    editTooltip: 'Grade',
  };

  return (
    <DataTable
      columns={columns}
      data={submissions}
      title="Assignment Submissions"
      actions={true}
      selectable={true}
      {...actions}
    />
  );
};

export default SubmissionsTable;