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
  List,           // Added missing List
  ListItem,       // Added missing ListItem
  ListItemIcon,   // Added missing ListItemIcon
  ListItemText,   // Added missing ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Check as CheckIcon,           // Added missing CheckIcon
  School as SchoolIcon,          // Added missing SchoolIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RichTextEditor from '../../components/Common/RichTextEditor';
import FileUpload from '../../components/Common/FileUpload';

const steps = ['Basic Information', 'Course Content', 'Pricing & Settings', 'Review'];

const categories = [
  'programming',
  'design',
  'business',
  'marketing',
  'data-science',
  'ai-ml',
  'cloud-computing',
  'cybersecurity',
  'other',
];

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const schema = yup.object({
  title: yup.string().required('Course title is required').max(200, 'Title too long'),
  shortDescription: yup.string().required('Short description is required').max(200, 'Too long'),
  description: yup.string().required('Full description is required'),
  category: yup.string().required('Category is required'),
  level: yup.string().required('Level is required'),
  language: yup.string().required('Language is required'),
  price: yup.number().required('Price is required').min(0, 'Price cannot be negative'),
  discountedPrice: yup.number().min(0, 'Price cannot be negative').nullable(),
  prerequisites: yup.array().of(yup.string()),
  learningObjectives: yup.array().of(yup.string()),
  tags: yup.array().of(yup.string()),
});

const CreateCourse = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [modules, setModules] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

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
      shortDescription: '',
      description: '',
      category: '',
      level: 'beginner',
      language: 'en',
      price: 0,
      discountedPrice: null,
      prerequisites: [],
      learningObjectives: [],
      tags: [],
    },
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = (data) => {
    console.log('Course data:', {
      ...data,
      thumbnail,
      coverImage,
      modules,
      isPublished,
    });
    // API call would go here
    navigate('/courses');
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: '',
      description: '',
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const deleteModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex) => {
    const newLesson = {
      id: Date.now() + Math.random(),
      title: '',
      type: 'video',
      duration: 0,
      content: '',
    };
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push(newLesson);
    setModules(updatedModules);
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(updatedModules);
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setModules(updatedModules);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={2}
                {...register('shortDescription')}
                error={!!errors.shortDescription}
                helperText={errors.shortDescription?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Full Description
              </Typography>
              <RichTextEditor
                value={watch('description')}
                onChange={(value) => setValue('description', value)}
                placeholder="Provide a detailed description of your course..."
              />
              {errors.description && (
                <FormHelperText error>{errors.description.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select {...register('category')} label="Category">
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.level}>
                <InputLabel>Level</InputLabel>
                <Select {...register('level')} label="Level">
                  {levels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.level && (
                  <FormHelperText>{errors.level.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.language}>
                <InputLabel>Language</InputLabel>
                <Select {...register('language')} label="Language">
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.language && (
                  <FormHelperText>{errors.language.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Thumbnail Image
              </Typography>
              <FileUpload
                onUpload={(file) => setThumbnail(file)}
                acceptedFiles={['image/*']}
                maxSize={5242880} // 5MB
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Cover Image (Optional)
              </Typography>
              <FileUpload
                onUpload={(file) => setCoverImage(file)}
                acceptedFiles={['image/*']}
                maxSize={10485760} // 10MB
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Course Modules</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addModule}
              >
                Add Module
              </Button>
            </Box>

            {modules.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No modules added yet. Click "Add Module" to start building your course.
                </Typography>
              </Paper>
            ) : (
              modules.map((module, moduleIndex) => (
                <Paper key={module.id} sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DragIcon sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }} />
                    <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 600 }}>
                      Module {moduleIndex + 1}
                    </Typography>
                    <IconButton color="error" onClick={() => deleteModule(moduleIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Module Title"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={2}
                        value={module.description}
                        onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2">Lessons</Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => addLesson(moduleIndex)}
                    >
                      Add Lesson
                    </Button>
                  </Box>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <Box key={lesson.id} sx={{ mb: 2, p: 2, bgcolor: '#F7F9FC', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DragIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          Lesson {lessonIndex + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Lesson Title"
                            value={lesson.title}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                              value={lesson.type}
                              label="Type"
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)}
                            >
                              <MenuItem value="video">Video</MenuItem>
                              <MenuItem value="quiz">Quiz</MenuItem>
                              <MenuItem value="assignment">Assignment</MenuItem>
                              <MenuItem value="document">Document</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Duration (min)"
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', parseInt(e.target.value))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Content URL / Description"
                            value={lesson.content}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Paper>
              ))
            )}
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price ($)"
                type="number"
                {...register('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discounted Price ($)"
                type="number"
                {...register('discountedPrice')}
                error={!!errors.discountedPrice}
                helperText={errors.discountedPrice?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={watch('prerequisites')}
                onChange={(e, newValue) => setValue('prerequisites', newValue)}
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
                    label="Prerequisites"
                    placeholder="Add prerequisites"
                    helperText="Press enter to add each prerequisite"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={watch('learningObjectives')}
                onChange={(e, newValue) => setValue('learningObjectives', newValue)}
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
                    label="Learning Objectives"
                    placeholder="What will students learn?"
                    helperText="Press enter to add each objective"
                  />
                )}
              />
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
                    helperText="Press enter to add tags (e.g., javascript, react)"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                }
                label="Publish course immediately"
              />
            </Grid>
          </Grid>
        );

      case 3:
        const formData = watch();
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your course information before submitting.
            </Alert>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {formData.title || 'Untitled Course'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={formData.level} size="small" />
                <Chip label={formData.category} size="small" />
                <Chip label={`$${formData.price}`} size="small" color="primary" />
                {formData.discountedPrice && (
                  <Chip label={`$${formData.discountedPrice}`} size="small" color="success" />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {formData.shortDescription || 'No description provided'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Prerequisites:
                  </Typography>
                  {formData.prerequisites?.length > 0 ? (
                    <List dense>
                      {formData.prerequisites.map((prereq, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={prereq} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      None specified
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Learning Objectives:
                  </Typography>
                  {formData.learningObjectives?.length > 0 ? (
                    <List dense>
                      {formData.learningObjectives.map((obj, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={obj} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      None specified
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Course Structure:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {modules.length} modules • {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
              </Typography>

              {modules.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {modules.map((module, index) => (
                    <Box key={module.id} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Module {index + 1}: {module.title || 'Untitled Module'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {module.lessons.length} lessons
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Status:
              </Typography>
              <Chip
                label={isPublished ? 'Published' : 'Draft'}
                color={isPublished ? 'success' : 'default'}
                size="small"
              />
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
          Create New Course
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Share your knowledge with the world
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
                  Create Course
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

export default CreateCourse;