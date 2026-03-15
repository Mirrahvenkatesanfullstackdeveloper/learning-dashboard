import React from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import DataTable from './DataTable';

const GradesTable = ({ grades, onViewReport, onPrint }) => {
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  const columns = [
    {
      field: 'student',
      headerName: 'Student',
      minWidth: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.student?.firstName} {row.student?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student?.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'course',
      headerName: 'Course',
      minWidth: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.course?.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.course?.code}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'assignments',
      headerName: 'Assignments',
      minWidth: 150,
      align: 'center',
      renderCell: (row) => (
        <Chip
          label={`${row.completedAssignments}/${row.totalAssignments}`}
          color={row.completedAssignments === row.totalAssignments ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'average',
      headerName: 'Average',
      minWidth: 150,
      sortable: true,
      renderCell: (row) => {
        const percentage = (row.totalScore / row.totalPoints) * 100;
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">{row.totalScore}/{row.totalPoints}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {percentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={getGradeColor(percentage)}
              sx={{
                height: 6,
                borderRadius: 3,
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'grade',
      headerName: 'Grade',
      minWidth: 100,
      align: 'center',
      renderCell: (row) => {
        const percentage = (row.totalScore / row.totalPoints) * 100;
        let letterGrade = 'F';
        if (percentage >= 90) letterGrade = 'A';
        else if (percentage >= 80) letterGrade = 'B';
        else if (percentage >= 70) letterGrade = 'C';
        else if (percentage >= 60) letterGrade = 'D';

        return (
          <Chip
            label={letterGrade}
            color={getGradeColor(percentage)}
            sx={{ fontWeight: 600, minWidth: 40 }}
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      align: 'center',
      renderCell: (row) => {
        const status = row.completedAssignments === row.totalAssignments ? 'Completed' : 'In Progress';
        return (
          <Chip
            label={status}
            color={status === 'Completed' ? 'success' : 'default'}
            size="small"
          />
        );
      },
    },
  ];

  const actions = {
    onView: onViewReport ? (row) => onViewReport(row) : undefined,
    onEdit: onPrint ? (row) => onPrint(row) : undefined,
    editIcon: <PrintIcon />,
    editTooltip: 'Print Report',
  };

  return (
    <DataTable
      columns={columns}
      data={grades}
      title="Grade Overview"
      actions={true}
      selectable={true}
      {...actions}
    />
  );
};

export default GradesTable;