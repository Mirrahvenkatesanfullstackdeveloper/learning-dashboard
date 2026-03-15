import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Grid,  // Added missing Grid import
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const QuizBuilder = ({ quiz, onChange }) => {
  const [questions, setQuestions] = useState(quiz?.questions || []);

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'short_answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
    { value: 'matching', label: 'Matching' },
  ];

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
    if (onChange) {
      onChange([...questions, newQuestion]);
    }
  };

  const updateQuestion = (id, field, value) => {
    const updatedQuestions = questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const updateOption = (questionId, optionIndex, value) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId
        ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            ),
          }
        : q
    );
    setQuestions(updatedQuestions);
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const addOption = (questionId) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId
        ? { ...q, options: [...q.options, ''] }
        : q
    );
    setQuestions(updatedQuestions);
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const deleteQuestion = (id) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQuestions(items);
    if (onChange) {
      onChange(items);
    }
  };

  const renderQuestionFields = (question, index) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Options:
            </Typography>
            {question.options.map((option, optIndex) => (
              <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Radio disabled size="small" sx={{ mr: 1 }} />
                <TextField
                  fullWidth
                  size="small"
                  value={option}
                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                />
                {question.options.length > 2 && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newOptions = question.options.filter((_, idx) => idx !== optIndex);
                      updateQuestion(question.id, 'options', newOptions);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addOption(question.id)}
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>
            <TextField
              fullWidth
              size="small"
              label="Correct Answer"
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 'true_false':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Correct Answer</FormLabel>
            <RadioGroup
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Correct Answer"
            value={question.correctAnswer}
            onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
          />
        );
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Quiz Questions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addQuestion}
        >
          Add Question
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{ p: 3, mb: 2, position: 'relative' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Box {...provided.dragHandleProps}>
                          <DragIcon sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ flex: 1 }}>
                          Question {index + 1}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>  {/* Fixed: Added space between Grid and item */}
                          <FormControl fullWidth size="small">
                            <InputLabel>Question Type</InputLabel>
                            <Select
                              value={question.type}
                              onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                              label="Question Type"
                            >
                              {questionTypes.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Points"
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Question"
                            multiline
                            rows={2}
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {renderQuestionFields(question, index)}
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {questions.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No questions added yet. Click "Add Question" to start building your quiz.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default QuizBuilder;