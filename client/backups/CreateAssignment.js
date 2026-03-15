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
  Switch,
  FormControlLabel,
  Slider,
  Autocomplete,
   List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RichTextEditor from '../../components/Common/RichTextEditor';
import FileUpload from '../../components/Common/FileUpload';
import QuizBuilder from '../../components/Forms/QuizBuilder';
import RubricBuilder from '../../components/Forms/RubricBuilder';

const steps = ['Basic Information', 'Content & Instructions', 'Rubric & Grading', 'Review'];

const assignmentTypes = [
  { value: 'assignment', label: 'Assignment' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'project', label: 'Project' },
  { value: 'exam', label: 'Exam' },
  { value: 'homework', label: 'Homework' },
];

const courses = [
  { id: 1, title: 'Full Stack Web Development Bootcamp' },
  { id: 2, title: 'Advanced React Patterns' },
  { id: 3, title: 'Database Design Fundamentals' },
  { id: 4, title: 'UI/UX Design Masterclass' },
];

const schema = yup.object({
  title: yup.string().required('Assignment title is required').max(200, 'Title too long'),
  description: yup.string().required('Description is required'),
  courseId: yup.string().required('Course is required'),
  type: yup.string().required('Assignment type is required'),
  totalPoints: yup.number().required('Total points is required').min(1, 'Minimum 1 point'),
  passingPoints: yup.number().min(0, 'Cannot be negative'),
  dueDate: yup.string().required('Due date is required'),
  availableFrom: yup.string().required('Available from date is required'),
});

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [rubric, setRubric] = useState([]);
  const [useRubric, setUseRubric] = useState(false);

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
      courseId: '',
      type: 'assignment',
      totalPoints: 100,
      passingPoints: 70,
      dueDate: '',
      availableFrom: new Date().toISOString().split('T')[0],
      availableUntil: '',
      timeLimit: 0,
      attemptsAllowed: 1,
      allowLateSubmissions: false,
      latePenalty: 10,
      maxFileSize: 10485760,
      allowedFileTypes: [],
    },
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = (data) => {
    const assignmentData = {
      ...data,
      attachments,
      ...(useRubric ? { rubric } : { quizQuestions }),
    };
    console.log('Assignment data:', assignmentData);
    // API call would go here
    navigate('/assignments');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.courseId}>
                <InputLabel>Course</InputLabel>
                <Select {...register('courseId')} label="Course">
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseId && (
                  <FormHelperText>{errors.courseId.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Assignment Type</InputLabel>
                <Select {...register('type')} label="Assignment Type">
                  {assignmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Points"
                type="number"
                {...register('totalPoints')}
                error={!!errors.totalPoints}
                helperText={errors.totalPoints?.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">points</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Passing Points"
                type="number"
                {...register('passingPoints')}
                error={!!errors.passingPoints}
                helperText={errors.passingPoints?.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">points</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Available From"
                type="datetime-local"
                {...register('availableFrom')}
                error={!!errors.availableFrom}
                helperText={errors.availableFrom?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="datetime-local"
                {...register('dueDate')}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Available Until (Optional)"
                type="datetime-local"
                {...register('availableUntil')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Assignment Description
              </Typography>
              <RichTextEditor
                value={watch('description')}
                onChange={(value) => setValue('description', value)}
                placeholder="Provide detailed instructions for the assignment..."
                height={300}
              />
              {errors.description && (
                <FormHelperText error>{errors.description.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments (Optional)
              </Typography>
              <FileUpload
                onUpload={(files) => setAttachments(files)}
                multiple={true}
                acceptedFiles={['.pdf', '.doc', '.docx', '.zip', '.js', '.jsx']}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time Limit (minutes)"
                type="number"
                {...register('timeLimit')}
                helperText="0 for no time limit"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Attempts Allowed"
                type="number"
                {...register('attemptsAllowed')}
                helperText="Number of submission attempts"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('allowLateSubmissions')}
                  />
                }
                label="Allow Late Submissions"
              />
            </Grid>

            {watch('allowLateSubmissions') && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Late Penalty (%)"
                  type="number"
                  {...register('latePenalty')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Submission Settings
              </Typography>
              <TextField
                fullWidth
                label="Max File Size (bytes)"
                type="number"
                {...register('maxFileSize')}
                helperText="10MB = 10485760 bytes"
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                freeSolo
                options={['.pdf', '.doc', '.docx', '.zip', '.js', '.jsx', '.jpg', '.png']}
                value={watch('allowedFileTypes')}
                onChange={(e, newValue) => setValue('allowedFileTypes', newValue)}
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
                    label="Allowed File Types"
                    placeholder="Add file extensions"
                    helperText="Press enter to add each file type"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useRubric}
                    onChange={(e) => setUseRubric(e.target.checked)}
                  />
                }
                label="Use Rubric for Grading"
              />
            </Box>

            {useRubric ? (
              <RubricBuilder
                rubric={rubric}
                onChange={setRubric}
              />
            ) : (
              <QuizBuilder
                quiz={quizQuestions}
                onChange={setQuizQuestions}
              />
            )}

            {!useRubric && quizQuestions.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Total Points: {quizQuestions.reduce((sum, q) => sum + (q.points || 0), 0)}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        const formData = watch();
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your assignment before creating.
            </Alert>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {formData.title || 'Untitled Assignment'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={formData.type} size="small" />
                <Chip label={`${formData.totalPoints} points`} size="small" color="primary" />
                <Chip
                  label={`Due: ${new Date(formData.dueDate).toLocaleDateString()}`}
                  size="small"
                  color="secondary"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                Course: {courses.find(c => c.id === parseInt(formData.courseId))?.title}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Description:
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: formData.description || 'No description provided' }} />

              {attachments.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Attachments:
                  </Typography>
                  <List>
                    {attachments.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Grading:
              </Typography>
              {useRubric ? (
                <Typography variant="body2">
                  Rubric with {rubric.length} criteria
                </Typography>
              ) : (
                <Typography variant="body2">
                  Quiz with {quizQuestions.length} questions
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Settings:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Time Limit
                  </Typography>
                  <Typography variant="body2">
                    {formData.timeLimit ? `${formData.timeLimit} minutes` : 'No limit'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Attempts Allowed
                  </Typography>
                  <Typography variant="body2">{formData.attemptsAllowed}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Late Submissions
                  </Typography>
                  <Typography variant="body2">
                    {formData.allowLateSubmissions ? `Allowed (${formData.latePenalty}% penalty)` : 'Not allowed'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Max File Size
                  </Typography>
                  <Typography variant="body2">
                    {(formData.maxFileSize / 1048576).toFixed(2)} MB
                  </Typography>
                </Grid>
              </Grid>
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
          Create New Assignment
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Create an assignment, quiz, or project for your students
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
                  Create Assignment
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

export default CreateAssignment;