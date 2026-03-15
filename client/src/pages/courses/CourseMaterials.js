import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  Description as DocumentIcon,
  PictureAsPdf as PdfIcon,
  OndemandVideo as VideoIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FileUpload from '../../components/Common/FileUpload';

const CourseMaterials = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock materials data
  const mockMaterials = {
    lectures: [
      {
        id: 1,
        title: 'Introduction to React Hooks',
        type: 'video',
        url: 'https://example.com/video1.mp4',
        size: 256000000, // 256MB
        uploadDate: '2024-02-15',
        module: 'Module 1: React Fundamentals',
        downloads: 234,
      },
      {
        id: 2,
        title: 'useState Deep Dive',
        type: 'video',
        url: 'https://example.com/video2.mp4',
        size: 189000000,
        uploadDate: '2024-02-16',
        module: 'Module 1: React Fundamentals',
        downloads: 189,
      },
      {
        id: 3,
        title: 'useEffect Complete Guide',
        type: 'video',
        url: 'https://example.com/video3.mp4',
        size: 312000000,
        uploadDate: '2024-02-17',
        module: 'Module 1: React Fundamentals',
        downloads: 156,
      },
    ],
    documents: [
      {
        id: 4,
        title: 'Course Syllabus',
        type: 'pdf',
        url: 'https://example.com/syllabus.pdf',
        size: 2450000, // 2.45MB
        uploadDate: '2024-02-14',
        pages: 12,
        downloads: 567,
      },
      {
        id: 5,
        title: 'React Cheat Sheet',
        type: 'pdf',
        url: 'https://example.com/cheatsheet.pdf',
        size: 890000,
        uploadDate: '2024-02-15',
        pages: 4,
        downloads: 890,
      },
      {
        id: 6,
        title: 'Assignment 1 Instructions',
        type: 'doc',
        url: 'https://example.com/assignment1.docx',
        size: 1200000,
        uploadDate: '2024-02-16',
        pages: 8,
        downloads: 234,
      },
    ],
    links: [
      {
        id: 7,
        title: 'React Official Documentation',
        url: 'https://reactjs.org/docs',
        description: 'Official React documentation and guides',
        addedBy: 'Instructor',
        addedDate: '2024-02-14',
      },
      {
        id: 8,
        title: 'GitHub Repository',
        url: 'https://github.com/course/react-bootcamp',
        description: 'Course code examples and projects',
        addedBy: 'Instructor',
        addedDate: '2024-02-15',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setMaterials(mockMaterials);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'video':
        return <VideoIcon color="primary" />;
      case 'doc':
      case 'docx':
        return <DocumentIcon color="info" />;
      case 'link':
        return <LinkIcon color="action" />;
      default:
        return <FileIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (material) => {
    // Implement download logic
    console.log('Downloading:', material);
  };

  const handleDelete = (material) => {
    // Implement delete logic
    console.log('Deleting:', material);
  };

  const filteredMaterials = () => {
    const currentTab = tabValue === 0 ? 'lectures' : tabValue === 1 ? 'documents' : 'links';
    const items = materials[currentTab] || [];
    
    if (!searchTerm) return items;
    
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const canEdit = user?.role === 'coordinator' || user?.role === 'educator';

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/courses" color="inherit">
            Courses
          </Link>
          <Link component={RouterLink} to={`/courses/${id}`} color="inherit">
            Course Details
          </Link>
          <Typography color="text.primary">Materials</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Course Materials
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access all learning resources for this course
            </Typography>
          </Box>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Upload Material
            </Button>
          )}
        </Box>
      </Box>

      {/* Search and Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </Box>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ borderTop: '1px solid #E2E8F0' }}
        >
          <Tab label="Lectures" />
          <Tab label="Documents" />
          <Tab label="External Links" />
        </Tabs>
      </Paper>

      {/* Materials List */}
      <Paper>
        {loading ? (
          <Box sx={{ p: 4 }}>
            <LinearProgress />
          </Box>
        ) : filteredMaterials().length > 0 ? (
          <List>
            {filteredMaterials().map((material, index) => (
              <React.Fragment key={material.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => handleDownload(material)}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      {canEdit && (
                        <>
                          <IconButton edge="end" sx={{ mr: 1 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDelete(material)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getFileIcon(material.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {material.title}
                        </Typography>
                        {material.module && (
                          <Chip
                            label={material.module}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {material.size && (
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(material.size)}
                          </Typography>
                        )}
                        {material.pages && (
                          <Typography variant="caption" color="text.secondary">
                            {material.pages} pages
                          </Typography>
                        )}
                        {material.downloads && (
                          <Typography variant="caption" color="text.secondary">
                            {material.downloads} downloads
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Added: {new Date(material.uploadDate || material.addedDate).toLocaleDateString()}
                        </Typography>
                        {material.url && material.type !== 'link' && (
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            href={material.url}
                            target="_blank"
                          >
                            Preview
                          </Button>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredMaterials().length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No materials found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try a different search term' : 'No materials have been added to this course yet'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Course Material</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FileUpload
              onUpload={(files) => {
                console.log('Uploaded:', files);
                setUploadDialogOpen(false);
              }}
              multiple={true}
              acceptedFiles={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.mp4', '.mov', '.zip']}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseMaterials;