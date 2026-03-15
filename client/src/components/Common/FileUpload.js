import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({
  onUpload,
  maxSize = 10485760, // 10MB
  acceptedFiles = ['image/*', 'application/pdf', '.doc', '.docx'],
  multiple = false,
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending',
    }));
    
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    
    // Simulate upload
    newFiles.forEach(uploadFile);
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFiles.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple,
  });

  const uploadFile = (fileObj) => {
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles(prev =>
        prev.map(f =>
          f.id === fileObj.id ? { ...f, progress } : f
        )
      );
      
      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileObj.id ? { ...f, status: 'success' } : f
          )
        );
        setUploading(false);
        if (onUpload) {
          onUpload(fileObj.file);
        }
      }
    }, 300);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : '#E2E8F0',
          borderRadius: 2,
          bgcolor: isDragActive ? 'rgba(102, 126, 234, 0.05)' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'rgba(102, 126, 234, 0.05)',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center' }}>
          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select files
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Supported formats: {acceptedFiles.join(', ')}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Max size: {formatFileSize(maxSize)}
          </Typography>
        </Box>
      </Paper>

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                border: '1px solid #E2E8F0',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={formatFileSize(file.size)}
              />
              {file.status === 'pending' && file.progress < 100 && (
                <Box sx={{ width: '100px', mr: 2 }}>
                  <LinearProgress variant="determinate" value={file.progress} />
                </Box>
              )}
              {file.status === 'success' && (
                <SuccessIcon color="success" sx={{ mr: 2 }} />
              )}
              {file.status === 'error' && (
                <ErrorIcon color="error" sx={{ mr: 2 }} />
              )}
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => removeFile(file.id)}>
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUpload;