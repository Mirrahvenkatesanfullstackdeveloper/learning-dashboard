import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Alert,
  Paper,  // Added missing Paper import
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatters';
import FileUpload from '../Common/FileUpload';

const SubmissionModal = ({
  open,
  onClose,
  submission,
  assignment,
  onSubmit,
  mode = 'view', // 'view', 'submit', 'grade'
}) => {
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState('');
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        files,
        comments,
      });
    }
  };

  const handleGrade = () => {
    if (onSubmit) {
      onSubmit({
        grade: parseInt(grade),
        feedback,
      });
    }
    onClose();
  };

  const downloadFile = (file) => {
    // Implement file download
    window.open(file.url, '_blank');
  };

  const isLate = () => {
    if (!submission && assignment) {
      return new Date() > new Date(assignment.dueDate);
    }
    return submission?.status === 'late';
  };

  const getTimeRemaining = () => {
    if (!assignment) return null;
    
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diff = due - now;
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Due soon';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {mode === 'view' && 'Submission Details'}
          {mode === 'submit' && 'Submit Assignment'}
          {mode === 'grade' && 'Grade Submission'}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Assignment Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {assignment?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {assignment?.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              icon={<ScheduleIcon />}
              label={`Due: ${formatDate(assignment?.dueDate, 'full')}`}
              variant="outlined"
              color={isLate() ? 'error' : 'default'}
            />
            <Chip
              icon={<GradeIcon />}
              label={`Points: ${assignment?.totalPoints}`}
              variant="outlined"
            />
          </Box>

          {mode === 'submit' && !submission && (
            <Alert severity={isLate() ? 'error' : 'info'} sx={{ mt: 2 }}>
              {isLate() 
                ? 'This assignment is overdue. Late submissions may be penalized.'
                : getTimeRemaining()
              }
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {mode === 'view' && submission && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Submission Details
              </Typography>
              <Chip
                label={submission.status}
                color={
                  submission.status === 'graded' ? 'success' :
                  submission.status === 'late' ? 'error' :
                  'info'
                }
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Submitted by:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2">
                  {submission.student?.firstName} {submission.student?.lastName}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {formatDate(submission.submittedAt, 'full')}
              </Typography>
            </Box>

            {submission.comments && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Student Comments:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F7F9FC' }}>
                  <Typography variant="body2">{submission.comments}</Typography>
                </Paper>
              </Box>
            )}

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Submitted Files:
            </Typography>
            <List>
              {submission.files?.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => downloadFile(file)}>
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <FileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  />
                </ListItem>
              ))}
            </List>

            {submission.status === 'graded' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Grade & Feedback
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                  <Typography variant="h4" color="primary">
                    {submission.grade?.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {assignment?.totalPoints}
                  </Typography>
                </Box>
                {submission.grade?.feedback && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F7F9FC' }}>
                    <Typography variant="body2">{submission.grade.feedback}</Typography>
                  </Paper>
                )}
              </Box>
            )}
          </Box>
        )}

        {mode === 'submit' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Upload your work
            </Typography>
            <FileUpload
              onUpload={(files) => setFiles(files)}
              multiple={true}
              acceptedFiles={['.pdf', '.doc', '.docx', '.zip', '.jpg', '.png']}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ mt: 3 }}
              placeholder="Add any comments about your submission..."
            />
          </Box>
        )}

        {mode === 'grade' && submission && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Grade Submission
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Student: {submission.student?.firstName} {submission.student?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted: {formatDate(submission.submittedAt, 'full')}
              </Typography>
            </Box>

            {submission.comments && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Student Comments:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F7F9FC' }}>
                  <Typography variant="body2">{submission.comments}</Typography>
                </Paper>
              </Box>
            )}

            <TextField
              fullWidth
              type="number"
              label="Score"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              InputProps={{
                endAdornment: <Typography variant="caption">/ {assignment?.totalPoints}</Typography>
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback to the student..."
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {mode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {mode === 'submit' && (
          <Button onClick={handleSubmit} variant="contained">
            Submit Assignment
          </Button>
        )}
        {mode === 'grade' && (
          <Button onClick={handleGrade} variant="contained" color="primary">
            Submit Grade
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionModal;