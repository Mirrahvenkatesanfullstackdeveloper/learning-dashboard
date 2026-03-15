import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const RubricBuilder = ({ rubric, onChange }) => {
  const [criteria, setCriteria] = useState(rubric || []);

  const levels = ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Poor'];
  const levelColors = ['#48BB78', '#F8B042', '#4299E1', '#ED8936', '#F56565'];

  const addCriterion = () => {
    const newCriterion = {
      id: Date.now().toString(),
      name: '',
      description: '',
      weight: 0,
      levels: levels.map((level, index) => ({
        level,
        points: 0,
        description: '',
      })),
    };
    setCriteria([...criteria, newCriterion]);
    if (onChange) {
      onChange([...criteria, newCriterion]);
    }
  };

  const updateCriterion = (id, field, value) => {
    const updatedCriteria = criteria.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setCriteria(updatedCriteria);
    if (onChange) {
      onChange(updatedCriteria);
    }
  };

  const updateLevel = (criterionId, levelIndex, field, value) => {
    const updatedCriteria = criteria.map(c =>
      c.id === criterionId
        ? {
            ...c,
            levels: c.levels.map((l, idx) =>
              idx === levelIndex ? { ...l, [field]: value } : l
            ),
          }
        : c
    );
    setCriteria(updatedCriteria);
    if (onChange) {
      onChange(updatedCriteria);
    }
  };

  const deleteCriterion = (id) => {
    const updatedCriteria = criteria.filter(c => c.id !== id);
    setCriteria(updatedCriteria);
    if (onChange) {
      onChange(updatedCriteria);
    }
  };

  const calculateTotalWeight = () => {
    return criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Grading Rubric</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addCriterion}
        >
          Add Criterion
        </Button>
      </Box>

      {criteria.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '20%' }}>Criteria</TableCell>
                {levels.map((level, index) => (
                  <TableCell
                    key={level}
                    align="center"
                    style={{ backgroundColor: levelColors[index] + '20' }}
                  >
                    <Typography variant="subtitle2" color={levelColors[index]}>
                      {level}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {criteria.map((criterion) => (
                <TableRow key={criterion.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Criterion name"
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Description"
                      multiline
                      rows={2}
                      value={criterion.description}
                      onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                      sx={{ mt: 1 }}
                    />
                  </TableCell>
                  {criterion.levels.map((level, levelIndex) => (
                    <TableCell key={level.level}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Points"
                        value={level.points}
                        onChange={(e) => updateLevel(criterion.id, levelIndex, 'points', parseInt(e.target.value))}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Description"
                        multiline
                        rows={2}
                        value={level.description}
                        onChange={(e) => updateLevel(criterion.id, levelIndex, 'description', e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="h6">{criterion.weight}%</Typography>
                      <Slider
                        value={criterion.weight}
                        onChange={(e, val) => updateCriterion(criterion.id, 'weight', val)}
                        min={0}
                        max={100}
                        step={5}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => deleteCriterion(criterion.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={levels.length + 1} align="right">
                  <Typography variant="subtitle1">Total Weight:</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="h6"
                    color={calculateTotalWeight() === 100 ? 'success.main' : 'error.main'}
                  >
                    {calculateTotalWeight()}%
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No criteria added yet. Click "Add Criterion" to start building your rubric.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default RubricBuilder;