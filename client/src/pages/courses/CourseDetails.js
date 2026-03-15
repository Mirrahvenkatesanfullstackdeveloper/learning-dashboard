import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Avatar,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  LinearProgress,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  PlayCircle as PlayIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  MenuBook as BookIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  VideoLibrary as VideoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  WhatsApp as WhatsAppIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StyledCard from '../../components/Cards/StyledCard';
import EnrollModal from '../../components/Modals/EnrollModal';
import { backgrounds } from '../../assets/images/backgrounds';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedModule, setExpandedModule] = useState(null);

  // Mock course data
  const mockCourse = {
    id: 1,
    title: 'Full Stack Web Development Bootcamp',
    description: 'Become a full-stack web developer with this comprehensive bootcamp. Learn front-end and back-end development, databases, and deployment. Build real-world projects and get job-ready.',
    longDescription: `
      This comprehensive bootcamp will take you from absolute beginner to job-ready full-stack developer. You'll learn:

      • Front-end development with React.js
      • Back-end development with Node.js and Express
      • Database management with MongoDB and SQL
      • RESTful API design and implementation
      • Authentication and authorization
      • Deployment and DevOps basics
      • Version control with Git
      • Testing and debugging

      By the end of this course, you'll have built multiple real-world projects and have a portfolio to showcase to employers.
    `,
    category: 'programming',
    level: 'beginner',
    language: 'English',
    instructor: {
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      title: 'Senior Full Stack Developer',
      bio: '10+ years of experience in web development. Previously worked at Google and Meta.',
      profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 4.9,
      students: 15000,
      courses: 12,
    },
    price: 499.99,
    discountedPrice: 399.99,
    currency: 'USD',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    totalDuration: 4800,
    totalModules: 12,
    totalLessons: 156,
    totalQuizzes: 24,
    totalAssignments: 8,
    totalEnrollments: 1245,
    averageRating: 4.5,
    totalRatings: 890,
    lastUpdated: '2024-01-15',
    requirements: [
      'Basic computer skills',
      'No prior programming experience required',
      'A computer with internet connection',
      'Willingness to learn',
    ],
    learningObjectives: [
      'Build full-stack web applications from scratch',
      'Master React.js for front-end development',
      'Create RESTful APIs with Node.js and Express',
      'Work with MongoDB and SQL databases',
      'Implement user authentication and authorization',
      'Deploy applications to cloud platforms',
      'Use Git for version control',
      'Write clean, maintainable code',
    ],
    targetAudience: [
      'Beginners who want to become web developers',
      'Programmers looking to learn full-stack development',
      'Entrepreneurs who want to build their own products',
      'Anyone interested in a career in tech',
    ],
    modules: [
      {
        id: 1,
        title: 'Getting Started with Web Development',
        description: 'Introduction to web development basics and setup',
        duration: 240,
        lessons: [
          { id: 1, title: 'Course Overview', type: 'video', duration: 15, isFree: true },
          { id: 2, title: 'Setting Up Development Environment', type: 'video', duration: 25 },
          { id: 3, title: 'How the Web Works', type: 'video', duration: 20 },
          { id: 4, title: 'Introduction to HTML', type: 'video', duration: 30 },
          { id: 5, title: 'HTML Basics Quiz', type: 'quiz', duration: 15 },
        ],
      },
      {
        id: 2,
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web pages',
        duration: 360,
        lessons: [
          { id: 6, title: 'HTML Document Structure', type: 'video', duration: 20 },
          { id: 7, title: 'Working with Forms', type: 'video', duration: 35 },
          { id: 8, title: 'CSS Selectors and Properties', type: 'video', duration: 40 },
          { id: 9, title: 'CSS Layouts: Flexbox and Grid', type: 'video', duration: 45 },
          { id: 10, title: 'Responsive Design', type: 'video', duration: 30 },
          { id: 11, title: 'HTML/CSS Project', type: 'assignment', duration: 120 },
        ],
      },
      {
        id: 3,
        title: 'JavaScript Essentials',
        description: 'Master the programming language of the web',
        duration: 480,
        lessons: [
          { id: 12, title: 'Variables and Data Types', type: 'video', duration: 25 },
          { id: 13, title: 'Functions and Scope', type: 'video', duration: 35 },
          { id: 14, title: 'Arrays and Objects', type: 'video', duration: 30 },
          { id: 15, title: 'DOM Manipulation', type: 'video', duration: 40 },
          { id: 16, title: 'Events and Event Handling', type: 'video', duration: 25 },
          { id: 17, title: 'JavaScript Quiz', type: 'quiz', duration: 20 },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 5,
        date: '2024-02-15',
        comment: 'Best course I\'ve ever taken! The instructor explains everything clearly and the projects are very practical.',
      },
      {
        id: 2,
        user: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        rating: 4,
        date: '2024-02-10',
        comment: 'Great content and well-structured. Would recommend to anyone starting their web development journey.',
      },
      {
        id: 3,
        user: 'Mike Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        rating: 5,
        date: '2024-02-05',
        comment: 'The instructor is amazing! The projects helped me build confidence in my skills.',
      },
    ],
    faqs: [
      {
        question: 'Do I need any prior experience?',
        answer: 'No, this course is designed for absolute beginners. We start from the basics and gradually build up to advanced concepts.',
      },
      {
        question: 'How long do I have access to the course?',
        answer: 'You get lifetime access to the course materials, including all future updates.',
      },
      {
        question: 'Is there a certificate upon completion?',
        answer: 'Yes, you will receive a verified certificate of completion that you can share on LinkedIn.',
      },
      {
        question: 'Can I get a refund if I\'m not satisfied?',
        answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, you can request a full refund.',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleEnroll = () => {
    if (user) {
      setEnrollModalOpen(true);
    } else {
      navigate('/login', { state: { from: `/courses/${id}` } });
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayIcon color="primary" />;
      case 'quiz':
        return <QuizIcon color="warning" />;
      case 'assignment':
        return <AssignmentIcon color="success" />;
      default:
        return <BookIcon color="info" />;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
          <Skeleton variant="text" height={30} width="60%" />
          <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/courses" color="inherit">
          Courses
        </Link>
        <Typography color="text.primary">{course?.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Course Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {course?.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={course?.averageRating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({course?.totalRatings} reviews)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {course?.totalEnrollments} students
                </Typography>
              </Box>
              <Chip label={course?.level} size="small" color="primary" variant="outlined" />
              <Chip label={course?.category} size="small" color="secondary" variant="outlined" />
              <Typography variant="body2" color="text.secondary">
                Last updated {new Date(course?.lastUpdated).toLocaleDateString()}
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {course?.description}
            </Typography>
          </Paper>

          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
            >
              <Tab label="Curriculum" />
              <Tab label="Overview" />
              <Tab label="Reviews" />
              <Tab label="FAQ" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Curriculum Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Course Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course?.totalModules} modules • {course?.totalLessons} lessons • {formatDuration(course?.totalDuration)} total length
                  </Typography>

                  {course?.modules.map((module) => (
                    <Accordion
                      key={module.id}
                      expanded={expandedModule === module.id}
                      onChange={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      sx={{ mb: 1 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {module.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              {module.lessons.length} lessons
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDuration(module.duration)}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {module.lessons.map((lesson) => (
                            <ListItem key={lesson.id} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {getLessonIcon(lesson.type)}
                              </ListItemIcon>
                              <ListItemText
                                primary={lesson.title}
                                secondary={formatDuration(lesson.duration)}
                              />
                              {lesson.isFree && (
                                <Chip label="Preview" size="small" color="success" />
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {/* Overview Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    About This Course
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {course?.longDescription}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        What You'll Learn
                      </Typography>
                      <List>
                        {course?.learningObjectives.map((objective, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={objective} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Requirements
                      </Typography>
                      <List>
                        {course?.requirements.map((req, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={req} />
                          </ListItem>
                        ))}
                      </List>

                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                        Target Audience
                      </Typography>
                      <List>
                        {course?.targetAudience.map((audience, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <PeopleIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={audience} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Reviews Tab */}
              {activeTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ textAlign: 'center', mr: 4 }}>
                      <Typography variant="h2" color="primary">
                        {course?.averageRating}
                      </Typography>
                      <Rating value={course?.averageRating} precision={0.5} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {course?.totalRatings} reviews
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = Math.floor(Math.random() * 500) + 100;
                        const percentage = (count / course?.totalRatings) * 100;
                        return (
                          <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ minWidth: 30 }}>
                              {star} ★
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                flex: 1,
                                mx: 1,
                                height: 8,
                                borderRadius: 4,
                              }}
                            />
                            <Typography variant="body2" sx={{ minWidth: 40 }}>
                              {count}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {course?.reviews.map((review) => (
                    <Box key={review.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={review.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2">{review.user}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              {new Date(review.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" paragraph>
                        {review.comment}
                      </Typography>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              )}

              {/* FAQ Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Frequently Asked Questions
                  </Typography>
                  {course?.faqs.map((faq, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Q: {faq.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        A: {faq.answer}
                      </Typography>
                      {index < course.faqs.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <StyledCard
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              pattern={backgrounds.pattern2}
              sx={{ mb: 3 }}
            >
              <CardMedia
                component="img"
                height="200"
                image={course?.thumbnail}
                alt={course?.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                  ${course?.discountedPrice || course?.price}
                  {course?.discountedPrice && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '1rem',
                        textDecoration: 'line-through',
                        ml: 1,
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      ${course?.price}
                    </Typography>
                  )}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleEnroll}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    mb: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Enroll Now
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={() => setBookmarked(!bookmarked)}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {bookmarked ? 'Bookmarked' : 'Add to Wishlist'}
                </Button>
              </CardContent>
            </StyledCard>

            {/* Course Includes */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                This Course Includes
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <VideoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`${course?.totalLessons} hours on-demand video`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`${course?.totalAssignments} coding assignments`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DownloadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Downloadable resources" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrophyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Certificate of completion" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Lifetime access" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Mobile and TV access" />
                </ListItem>
              </List>
            </Paper>

            {/* Instructor Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Instructor
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={course?.instructor.profilePicture}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {course?.instructor.firstName} {course?.instructor.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course?.instructor.title}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" paragraph>
                {course?.instructor.bio}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {course?.instructor.rating}
                  </Typography>
                  <Typography variant="caption">Rating</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {course?.instructor.students.toLocaleString()}
                  </Typography>
                  <Typography variant="caption">Students</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {course?.instructor.courses}
                  </Typography>
                  <Typography variant="caption">Courses</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Share */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Share This Course
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Share on WhatsApp">
                  <IconButton color="success">
                    <WhatsAppIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on Twitter">
                  <IconButton color="primary">
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on Facebook">
                  <IconButton color="primary">
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on LinkedIn">
                  <IconButton color="primary">
                    <LinkedInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy link">
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Enroll Modal */}
      <EnrollModal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        course={course}
        onEnroll={(data) => {
          console.log('Enrollment data:', data);
          setEnrollModalOpen(false);
          navigate('/payment/success');
        }}
      />
    </Container>
  );
};

export default CourseDetails;