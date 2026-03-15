import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  People as StudentsIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { backgrounds } from '../../assets/images/backgrounds';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.3)',
  },
}));

const CourseCard = ({ course, onEnroll, isEnrolled, progress }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handleViewCourse = () => {
    navigate(`/courses/${course._id}`);
  };

  return (
    <StyledCard>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={course.thumbnail || 'https://source.unsplash.com/random/800x600/?coding'}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label={course.level}
            size="small"
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              textTransform: 'capitalize',
            }}
          />
          <IconButton
            size="small"
            onClick={() => setIsBookmarked(!isBookmarked)}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.95)',
              },
            }}
          >
            {isBookmarked ? (
              <BookmarkIcon color="primary" fontSize="small" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {course.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {course.shortDescription}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StudentsIcon fontSize="small" color="action" />
            <Typography variant="caption">{course.totalEnrollments} students</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon fontSize="small" sx={{ color: '#f8b042' }} />
            <Typography variant="caption">{course.averageRating}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={course.instructor?.profilePicture}
              sx={{ width: 24, height: 24 }}
            >
              {course.instructor?.firstName?.charAt(0)}
            </Avatar>
            <Typography variant="caption">
              {course.instructor?.firstName} {course.instructor?.lastName}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
            ${course.discountedPrice || course.price}
            {course.discountedPrice && (
              <Typography
                component="span"
                variant="caption"
                sx={{ textDecoration: 'line-through', ml: 1, color: 'text.secondary' }}
              >
                ${course.price}
              </Typography>
            )}
          </Typography>
        </Box>

        {isEnrolled && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Progress</Typography>
              <Typography variant="caption">{progress}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                background: 'rgba(102, 126, 234, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant={isEnrolled ? 'outlined' : 'contained'}
          onClick={handleViewCourse}
          sx={{
            borderRadius: 2,
            py: 1,
          }}
        >
          {isEnrolled ? 'Continue Learning' : 'View Course'}
        </Button>
      </Box>
    </StyledCard>
  );
};

export default CourseCard;