import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Slider,
  Chip,
  Divider,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,  // Added missing import
} from '@mui/material';

const GradeModal = ({
  open,
  onClose,
  submission,
  rubric,
  onGrade,
}) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [rubricScores, setRubricScores] = useState({});
  const [gradeStatus, setGradeStatus] = useState('');

  useEffect(() => {
    if (submission) {
      setScore(submission.grade?.score || 0);
      setFeedback(submission.grade?.feedback || '');
      if (submission.grade?.rubricScores) {
        setRubricScores(submission.grade.rubricScores);
      }
    }
  }, [submission]);

  const handleRubricScoreChange = (criterionId, value) => {
    setRubricScores(prev => ({
      ...prev,
      [criterionId]: value,
    }));

    // Calculate total score based on rubric
    if (rubric) {
      const total = rubric.criteria.reduce((sum, criterion) => {
        const score = rubricScores[criterion.id] || 0;
        return sum + (score * (criterion.weight / 100));
      }, 0);
      setScore(Math.round(total * 100) / 100);
    }
  };

  const handleSubmit = () => {
    if (onGrade) {
      onGrade({
        score,
        feedback,
        rubricScores: Object.keys(rubricScores).length > 0 ? rubricScores : undefined,
        status: gradeStatus || 'graded',
      });
    }
    onClose();
  };

  const getMaxScore = () => {
    if (rubric) {
      return rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0);
    }
    return submission?.assignment?.totalPoints || 100;
  };

  const getScorePercentage = () => {
    const max = getMaxScore();
    return (score / max) * 100;
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
      <DialogTitle>
        <Typography variant="h6">Grade Submission</Typography>
        <Typography variant="body2" color="text.secondary">
          {submission?.student?.firstName} {submission?.student?.lastName} - {submission?.assignment?.title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {rubric ? (
          // Rubric-based grading
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Grading Rubric
            </Typography>
            {rubric.criteria.map((criterion) => (
              <Box key={criterion.id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {criterion.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Weight: {criterion.weight}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {criterion.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption">0</Typography>
                  <Slider
                    value={rubricScores[criterion.id] || 0}
                    onChange={(e, val) => handleRubricScoreChange(criterion.id, val)}
                    step={1}
                    marks={criterion.levels.map((level, index) => ({
                      value: level.points,
                      label: level.name,
                    }))}
                    min={0}
                    max={criterion.maxScore}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="caption">{criterion.maxScore}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  {criterion.levels.map((level) => (
                    <Chip
                      key={level.name}
                      label={`${level.name}: ${level.points}pts`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          // Simple grading
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Score
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={score}
                  onChange={(e) => setScore(parseFloat(e.target.value))}
                  InputProps={{
                    endAdornment: (
                      <Typography variant="caption">
                        / {getMaxScore()}
                      </Typography>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Percentage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getScorePercentage()}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getScorePercentage().toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quick Rating
              </Typography>
              <Rating
                value={getScorePercentage() / 20}
                onChange={(e, val) => setScore(val * 20)}
                size="large"
              />
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
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
        </Box>

        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Grade Status</InputLabel>
            <Select
              value={gradeStatus}
              onChange={(e) => setGradeStatus(e.target.value)}
              label="Grade Status"
            >
              <MenuItem value="graded">Published</MenuItem>
              <MenuItem value="draft">Save as Draft</MenuItem>
              <MenuItem value="returned">Return for Revision</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {getScorePercentage() >= 60 ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Student has passed this assignment.
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Student score is below passing threshold.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit Grade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeModal;