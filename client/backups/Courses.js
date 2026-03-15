import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  TextField,
  InputAdornment,
  Drawer,
  IconButton,
  useMediaQuery,
  Pagination,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Sort as SortIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import CourseCard from '../../components/Cards/CourseCard';
import StyledCard from '../../components/Cards/StyledCard';
import { backgrounds } from '../../assets/images/backgrounds';

// Mock courses data
const mockCourses = [
  {
    id: 1,
    title: 'Full Stack Web Development Bootcamp',
    shortDescription: 'Learn MERN stack from scratch and build real-world applications',
    description: 'Comprehensive course covering React, Node.js, MongoDB, Express',
    category: 'programming',
    level: 'beginner',
    instructor: {
      firstName: 'Jane',
      lastName: 'Smith',
      profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    price: 499.99,
    discountedPrice: 399.99,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    totalDuration: 4800,
    totalEnrollments: 1245,
    averageRating: 4.5,
    totalRatings: 890,
    isPublished: true,
    tags: ['react', 'node', 'mongodb'],
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    shortDescription: 'Master advanced React concepts and patterns',
    description: 'Deep dive into hooks, context, performance optimization',
    category: 'programming',
    level: 'advanced',
    instructor: {
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    price: 299.99,
    discountedPrice: 249.99,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    totalDuration: 1800,
    totalEnrollments: 845,
    averageRating: 5,
    totalRatings: 420,
    isPublished: true,
    tags: ['react', 'hooks', 'performance'],
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    shortDescription: 'Learn design principles and tools',
    description: 'Complete guide to UI/UX design from basics to advanced',
    category: 'design',
    level: 'beginner',
    instructor: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    price: 399.99,
    discountedPrice: 299.99,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    totalDuration: 3600,
    totalEnrollments: 678,
    averageRating: 4.8,
    totalRatings: 312,
    isPublished: true,
    tags: ['ui', 'ux', 'figma'],
  },
  {
    id: 4,
    title: 'Data Science Fundamentals',
    shortDescription: 'Master data analysis and machine learning',
    description: 'Comprehensive data science course with Python',
    category: 'data-science',
    level: 'intermediate',
    instructor: {
      firstName: 'Michael',
      lastName: 'Chen',
      profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    price: 599.99,
    discountedPrice: 499.99,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    totalDuration: 5400,
    totalEnrollments: 956,
    averageRating: 4.7,
    totalRatings: 567,
    isPublished: true,
    tags: ['python', 'data-science', 'ml'],
  },
  {
    id: 5,
    title: 'DevOps Engineering',
    shortDescription: 'Master CI/CD, Docker, Kubernetes',
    description: 'Complete DevOps bootcamp for beginners',
    category: 'devops',
    level: 'intermediate',
    instructor: {
      firstName: 'David',
      lastName: 'Wilson',
      profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    price: 449.99,
    discountedPrice: 399.99,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
    totalDuration: 4200,
    totalEnrollments: 534,
    averageRating: 4.6,
    totalRatings: 289,
    isPublished: true,
    tags: ['docker', 'kubernetes', 'jenkins'],
  },
  {
    id: 6,
    title: 'Mobile App Development with React Native',
    shortDescription: 'Build iOS and Android apps',
    description: 'Cross-platform mobile development',
    category: 'programming',
    level: 'intermediate',
    instructor: {
      firstName: 'Emily',
      lastName: 'Brown',
      profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    price: 349.99,
    discountedPrice: 299.99,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    totalDuration: 3200,
    totalEnrollments: 423,
    averageRating: 4.4,
    totalRatings: 198,
    isPublished: true,
    tags: ['react-native', 'mobile', 'ios', 'android'],
  },
  {
    id: 7,
    title: 'Cybersecurity Essentials',
    shortDescription: 'Learn network security and ethical hacking',
    description: 'Complete guide to cybersecurity',
    category: 'security',
    level: 'beginner',
    instructor: {
      firstName: 'Robert',
      lastName: 'Martinez',
      profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    price: 399.99,
    discountedPrice: 349.99,
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    totalDuration: 3800,
    totalEnrollments: 345,
    averageRating: 4.9,
    totalRatings: 167,
    isPublished: true,
    tags: ['security', 'ethical-hacking', 'network'],
  },
  {
    id: 8,
    title: 'Cloud Computing with AWS',
    shortDescription: 'Master Amazon Web Services',
    description: 'Complete AWS certification preparation',
    category: 'cloud',
    level: 'intermediate',
    instructor: {
      firstName: 'Lisa',
      lastName: 'Wang',
      profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    price: 549.99,
    discountedPrice: 449.99,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    totalDuration: 4600,
    totalEnrollments: 678,
    averageRating: 4.8,
    totalRatings: 345,
    isPublished: true,
    tags: ['aws', 'cloud', 'devops'],
  },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'programming', label: 'Programming' },
  { value: 'design', label: 'Design' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'devops', label: 'DevOps' },
  { value: 'security', label: 'Security' },
  { value: 'cloud', label: 'Cloud Computing' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
];

const levels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const Courses = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    priceRange: [0, 1000],
    search: '',
    sortBy: 'popular',
  });

  const coursesPerPage = 9;

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setCourses(mockCourses);
      applyFilters();
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, courses]);

  const applyFilters = () => {
    let filtered = [...courses];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Apply level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    // Apply price filter
    filtered = filtered.filter(course => 
      (course.discountedPrice || course.price) >= filters.priceRange[0] &&
      (course.discountedPrice || course.price) <= filters.priceRange[1]
    );

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.shortDescription.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.totalEnrollments - a.totalEnrollments);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    handleFilterChange('search', event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    handleFilterChange('priceRange', newValue);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      level: 'all',
      priceRange: [0, 1000],
      search: '',
      sortBy: 'popular',
    });
  };

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  const FilterContent = () => (
    <Box sx={{ p: 3, width: isMobile ? 'auto' : 280 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search courses..."
        value={filters.search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Category Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          label="Category"
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          {categories.map(cat => (
            <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Level Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Level</InputLabel>
        <Select
          value={filters.level}
          label="Level"
          onChange={(e) => handleFilterChange('level', e.target.value)}
        >
          {levels.map(level => (
            <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={50}
          valueLabelFormat={(value) => `$${value}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">${filters.priceRange[0]}</Typography>
          <Typography variant="caption">${filters.priceRange[1]}+</Typography>
        </Box>
      </Box>

      {/* Clear Filters */}
      <Button
        fullWidth
        variant="outlined"
        onClick={clearFilters}
        sx={{ mt: 2 }}
      >
        Clear All Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Explore Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our wide range of courses and start learning today
        </Typography>
      </Box>

      {/* Mobile Filter Button */}
      {isMobile && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDrawerOpen(true)}
            fullWidth
          >
            Filters
          </Button>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper sx={{ position: 'sticky', top: 100 }}>
              <FilterContent />
            </Paper>
          </Grid>
        )}

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        >
          <FilterContent />
        </Drawer>

        {/* Course Grid */}
        <Grid item xs={12} md={9}>
          {/* Desktop Sort Bar */}
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {paginatedCourses.length} of {filteredCourses.length} courses
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SortIcon sx={{ color: 'text.secondary' }} />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    displayEmpty
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}

          {/* Course Cards */}
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} lg={4} key={item}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="60%" />
                </Grid>
              ))}
            </Grid>
          ) : paginatedCourses.length > 0 ? (
            <Grid container spacing={3}>
              {paginatedCourses.map((course) => (
                <Grid item xs={12} sm={6} lg={4} key={course.id}>
                  <CourseCard
                    course={course}
                    onEnroll={() => navigate(`/courses/${course.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No courses found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your filters or search criteria
              </Typography>
              <Button variant="contained" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size={isMobile ? 'medium' : 'large'}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Courses;