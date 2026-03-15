import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  Alert,
  FormHelperText,
  InputAdornment,
  Autocomplete,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Slider,
  Avatar,
  List,              // Added missing List
  ListItem,          // Added missing ListItem
  ListItemAvatar,    // Added missing ListItemAvatar
  ListItemIcon,      // Added missing ListItemIcon
  ListItemText,      // Added missing ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const steps = ['Basic Information', 'Select Courses', 'Set Milestones', 'Review'];

const goals = [
  'Become a Full Stack Developer',
  'Learn Data Science',
  'Master UI/UX Design',
  'Get AWS Certified',
  'Learn DevOps',
  'Become a Cybersecurity Expert',
  'Custom Goal',
];

const difficulties = [
  { value: 'beginner', label: 'Beginner Friendly' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// Mock available courses
const availableCourses = [
  {
    id: 1,
    title: 'HTML/CSS Fundamentals',
    description: 'Learn the building blocks of web pages',
    category: 'programming',
    level: 'beginner',
    duration: 20,
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
    rating: 4.5,
    students: 15000,
  },
  {
    id: 2,
    title: 'JavaScript Essentials',
    description: 'Master the programming language of the web',
    category: 'programming',
    level: 'beginner',
    duration: 30,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
    rating: 4.8,
    students: 22000,
  },
  {
    id: 3,
    title: 'React.js Masterclass',
    description: 'Build modern user interfaces with React',
    category: 'programming',
    level: 'intermediate',
    duration: 40,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    rating: 4.9,
    students: 18000,
  },
  {
    id: 4,
    title: 'Node.js Backend Development',
    description: 'Create scalable backend services',
    category: 'programming',
    level: 'intermediate',
    duration: 35,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
    rating: 4.7,
    students: 12000,
  },
  {
    id: 5,
    title: 'Database Design',
    description: 'Work with SQL and NoSQL databases',
    category: 'programming',
    level: 'intermediate',
    duration: 25,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
    rating: 4.6,
    students: 9000,
  },
  {
    id: 6,
    title: 'DevOps Basics',
    description: 'Learn deployment and CI/CD',
    category: 'devops',
    level: 'beginner',
    duration: 20,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
    rating: 4.5,
    students: 8000,
  },
  {
    id: 7,
    title: 'Python for Data Science',
    description: 'Learn Python for data analysis',
    category: 'data-science',
    level: 'beginner',
    duration: 35,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-400b3c5b3b9b',
    rating: 4.8,
    students: 25000,
  },
  {
    id: 8,
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning',
    category: 'data-science',
    level: 'intermediate',
    duration: 45,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    rating: 4.9,
    students: 20000,
  },
];

const schema = yup.object({
  title: yup.string().required('Plan title is required').max(200, 'Title too long'),
  description: yup.string().required('Description is required').max(500, 'Description too long'),
  goal: yup.string().required('Learning goal is required'),
  difficulty: yup.string().required('Difficulty level is required'),
  weeklyHours: yup.number().required('Weekly hours commitment is required').min(1, 'Minimum 1 hour').max(40, 'Maximum 40 hours'),
  targetDate: yup.date().required('Target completion date is required').min(new Date(), 'Target date must be in the future'),
  isPublic: yup.boolean(),
  tags: yup.array().of(yup.string()),
});

const CreateStudyPlan = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [milestones, setMilestones] = useState([
    { id: 1, title: '', description: '', targetDate: null }
  ]);
  const [customGoal, setCustomGoal] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      goal: '',
      difficulty: 'beginner',
      weeklyHours: 10,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isPublic: true,
      tags: [],
    },
  });

  const handleNext = () => {
    if (activeStep === 1 && selectedCourses.length === 0) {
      alert('Please select at least one course');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { id: milestones.length + 1, title: '', description: '', targetDate: null }
    ]);
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleCourseToggle = (course) => {
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const onSubmit = (data) => {
    const planData = {
      ...data,
      goal: data.goal === 'Custom Goal' ? customGoal : data.goal,
      courses: selectedCourses,
      milestones: milestones.filter(m => m.title && m.targetDate),
      totalCourses: selectedCourses.length,
      totalHours: selectedCourses.reduce((acc, c) => acc + c.duration, 0),
      createdAt: new Date().toISOString(),
    };
    console.log('Study plan data:', planData);
    // API call would go here
    navigate('/study-plans');
  };

  const calculateTotalHours = () => {
    return selectedCourses.reduce((acc, c) => acc + c.duration, 0);
  };

  const calculateWeeksNeeded = () => {
    const totalHours = calculateTotalHours();
    const weeklyHours = watch('weeklyHours');
    return Math.ceil(totalHours / weeklyHours);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                placeholder="e.g., Full Stack Developer Path"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Describe your learning goals and what you want to achieve..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.goal}>
                <InputLabel>Learning Goal</InputLabel>
                <Select {...register('goal')} label="Learning Goal">
                  {goals.map((goal) => (
                    <MenuItem key={goal} value={goal}>
                      {goal}
                    </MenuItem>
                  ))}
                </Select>
                {errors.goal && (
                  <FormHelperText>{errors.goal.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Difficulty</InputLabel>
                <Select {...register('difficulty')} label="Difficulty">
                  {difficulties.map((diff) => (
                    <MenuItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.difficulty && (
                  <FormHelperText>{errors.difficulty.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {watch('goal') === 'Custom Goal' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Goal"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Enter your custom learning goal"
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weekly Hours Commitment"
                type="number"
                {...register('weeklyHours')}
                error={!!errors.weeklyHours}
                helperText={errors.weeklyHours?.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Target Completion Date"
                  value={watch('targetDate')}
                  onChange={(date) => setValue('targetDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.targetDate}
                      helperText={errors.targetDate?.message}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={watch('tags')}
                onChange={(e, newValue) => setValue('tags', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                    helperText="Press enter to add tags (e.g., web-development, career)"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('isPublic')}
                    defaultChecked
                  />
                }
                label="Make this plan public (others can view and bookmark)"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Courses for Your Plan
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Selected: {selectedCourses.length} courses • Total Hours: {calculateTotalHours()}h
            </Typography>

            <Grid container spacing={3}>
              {availableCourses.map((course) => {
                const isSelected = selectedCourses.find(c => c.id === course.id);
                return (
                  <Grid item xs={12} md={6} key={course.id}>
                    <Card
                      sx={{
                        display: 'flex',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #667EEA' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
                        },
                      }}
                      onClick={() => handleCourseToggle(course)}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 100, objectFit: 'cover' }}
                        image={course.thumbnail}
                        alt={course.title}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                          <Typography variant="subtitle2">
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {course.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            <Chip label={course.level} size="small" variant="outlined" />
                            <Chip label={`${course.duration}h`} size="small" variant="outlined" />
                            <Chip
                              icon={<SchoolIcon />}
                              label={`${course.students.toLocaleString()}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 1 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleCourseToggle(course)}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Rating: {course.rating} ★
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Set Learning Milestones
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Break down your plan into achievable milestones
            </Typography>

            {milestones.map((milestone, index) => (
              <Paper key={milestone.id} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    {index + 1}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    Milestone {index + 1}
                  </Typography>
                  {milestones.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveMilestone(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Milestone Title"
                      value={milestone.title}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                      placeholder="e.g., Complete Frontend Basics"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={2}
                      value={milestone.description}
                      onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                      placeholder="Describe what you'll achieve in this milestone"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Target Date"
                        value={milestone.targetDate}
                        onChange={(date) => handleMilestoneChange(index, 'targetDate', date)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddMilestone}
              variant="outlined"
              fullWidth
            >
              Add Milestone
            </Button>
          </Box>
        );

      case 3:
        const formData = watch();
        const totalHours = calculateTotalHours();
        const weeksNeeded = calculateWeeksNeeded();

        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your study plan before creating.
            </Alert>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {formData.title || 'Untitled Plan'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={formData.goal === 'Custom Goal' ? customGoal : formData.goal} size="small" color="primary" />
                <Chip label={formData.difficulty} size="small" />
                <Chip label={`${formData.weeklyHours} hours/week`} size="small" />
                <Chip
                  label={`Target: ${formData.targetDate ? new Date(formData.targetDate).toLocaleDateString() : ''}`}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {formData.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Plan Summary:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Courses
                  </Typography>
                  <Typography variant="h6">{selectedCourses.length}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                  <Typography variant="h6">{totalHours}h</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Weeks Needed
                  </Typography>
                  <Typography variant="h6">{weeksNeeded} weeks</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Daily Commitment
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(formData.weeklyHours / 7 * 10) / 10}h
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Selected Courses:
              </Typography>
              <List>
                {selectedCourses.map((course, index) => (
                  <ListItem key={course.id}>
                    <ListItemAvatar>
                      <Avatar src={course.thumbnail} variant="rounded" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={course.title}
                      secondary={`${course.duration} hours`}
                    />
                  </ListItem>
                ))}
              </List>

              {milestones.filter(m => m.title && m.targetDate).length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Milestones:
                  </Typography>
                  <List>
                    {milestones.map((milestone, index) => (
                      milestone.title && milestone.targetDate && (
                        <ListItem key={milestone.id}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24 }}>
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={milestone.title}
                            secondary={new Date(milestone.targetDate).toLocaleDateString()}
                          />
                        </ListItem>
                      )
                    ))}
                  </List>
                </>
              )}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
          Create Study Plan
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Design your personalized learning path
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Create Plan
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<PreviewIcon />}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateStudyPlan;