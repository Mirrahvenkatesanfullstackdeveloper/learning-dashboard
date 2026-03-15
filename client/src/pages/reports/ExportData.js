import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Card,            // Added missing Card
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Image as ImageIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
  DataUsage as DataIcon,
  DateRange as DateRangeIcon,  // Added missing DateRangeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { subDays, format } from 'date-fns';

const steps = ['Select Data', 'Choose Format', 'Configure Options', 'Export'];

const dataTypes = [
  { 
    id: 'users', 
    label: 'User Data', 
    icon: <DataIcon />, 
    description: 'Export user profiles, roles, and activity data',
    fields: ['Basic Info', 'Enrollment History', 'Activity Logs', 'Payment History'],
  },
  { 
    id: 'courses', 
    label: 'Course Data', 
    icon: <DataIcon />, 
    description: 'Export course information, modules, and materials',
    fields: ['Course Details', 'Enrollment Data', 'Completion Rates', 'Reviews & Ratings'],
  },
  { 
    id: 'assignments', 
    label: 'Assignment Data', 
    icon: <DataIcon />, 
    description: 'Export assignments, submissions, and grades',
    fields: ['Assignment Details', 'Submissions', 'Grades', 'Rubric Data'],
  },
  { 
    id: 'payments', 
    label: 'Payment Data', 
    icon: <DataIcon />, 
    description: 'Export payment transactions and invoices',
    fields: ['Transaction History', 'Invoices', 'Refunds', 'Revenue Reports'],
  },
  { 
    id: 'analytics', 
    label: 'Analytics Data', 
    icon: <DataIcon />, 
    description: 'Export platform analytics and metrics',
    fields: ['User Analytics', 'Course Analytics', 'Engagement Metrics', 'Performance Data'],
  },
];

const exportFormats = [
  { id: 'pdf', label: 'PDF Document', icon: <PdfIcon />, ext: '.pdf' },
  { id: 'excel', label: 'Excel Spreadsheet', icon: <ExcelIcon />, ext: '.xlsx' },
  { id: 'csv', label: 'CSV File', icon: <CsvIcon />, ext: '.csv' },
  { id: 'json', label: 'JSON Data', icon: <DataIcon />, ext: '.json' },
  { id: 'image', label: 'Image Report', icon: <ImageIcon />, ext: '.png' },
];

const ExportData = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedFields, setSelectedFields] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    includeSummary: true,
    compressFile: false,
    scheduleExport: false,
    emailNotification: false,
    emailAddress: '',
  });
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFieldToggle = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleSelectAllFields = () => {
    const dataType = dataTypes.find(d => d.id === selectedDataType);
    if (dataType && selectedFields.length !== dataType.fields.length) {
      setSelectedFields(dataType.fields);
    } else {
      setSelectedFields([]);
    }
  };

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleNewExport = () => {
    setActiveStep(0);
    setSelectedDataType('');
    setSelectedFormat('pdf');
    setSelectedFields([]);
    setExportComplete(false);
    setExportProgress(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select the type of data you want to export:
            </Typography>
            <Grid container spacing={2}>
              {dataTypes.map((type) => (
                <Grid item xs={12} md={6} key={type.id}>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: selectedDataType === type.id ? '2px solid #667EEA' : '1px solid #E2E8F0',
                      '&:hover': {
                        borderColor: '#667EEA',
                      },
                    }}
                    onClick={() => setSelectedDataType(type.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: '#667EEA20', color: '#667EEA', mr: 2 }}>
                        {type.icon}
                      </Avatar>
                      <Typography variant="h6">{type.label}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Choose export format:
            </Typography>
            <RadioGroup
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <Grid container spacing={2}>
                {exportFormats.map((format) => (
                  <Grid item xs={12} sm={6} md={4} key={format.id}>
                    <Paper
                      sx={{
                        p: 2,
                        border: selectedFormat === format.id ? '2px solid #667EEA' : '1px solid #E2E8F0',
                      }}
                    >
                      <FormControlLabel
                        value={format.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#667EEA20', color: '#667EEA', mr: 1, width: 32, height: 32 }}>
                              {format.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{format.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format.ext}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select date range:
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={dateRange.startDate}
                      onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date"
                      value={dateRange.endDate}
                      onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Box>
          </Box>
        );

      case 2:
        const dataType = dataTypes.find(d => d.id === selectedDataType);
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select fields to include:
            </Typography>
            
            {dataType && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    {dataType.label} Fields
                  </Typography>
                  <Button size="small" onClick={handleSelectAllFields}>
                    {selectedFields.length === dataType.fields.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </Box>
                <FormGroup>
                  {dataType.fields.map((field) => (
                    <FormControlLabel
                      key={field}
                      control={
                        <Checkbox
                          checked={selectedFields.includes(field)}
                          onChange={() => handleFieldToggle(field)}
                        />
                      }
                      label={field}
                    />
                  ))}
                </FormGroup>
              </Paper>
            )}

            <Typography variant="subtitle1" gutterBottom>
              Export options:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.includeHeaders}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeHeaders: e.target.checked })}
                    />
                  }
                  label="Include column headers"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.includeSummary}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeSummary: e.target.checked })}
                    />
                  }
                  label="Include summary statistics"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.compressFile}
                      onChange={(e) => setExportOptions({ ...exportOptions, compressFile: e.target.checked })}
                    />
                  }
                  label="Compress file (ZIP)"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Schedule export (optional):
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.scheduleExport}
                      onChange={(e) => setExportOptions({ ...exportOptions, scheduleExport: e.target.checked })}
                    />
                  }
                  label="Schedule this export"
                />
              </Grid>
              
              {exportOptions.scheduleExport && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value="daily"
                        label="Frequency"
                        onChange={(e) => {}} // Added empty onChange to prevent warning
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={exportOptions.emailNotification}
                          onChange={(e) => setExportOptions({ ...exportOptions, emailNotification: e.target.checked })}
                        />
                      }
                      label="Send email notification when ready"
                    />
                  </Grid>
                  
                  {exportOptions.emailNotification && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={exportOptions.emailAddress}
                        onChange={(e) => setExportOptions({ ...exportOptions, emailAddress: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Box>
        );

      case 3:
        if (exportComplete) {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#48BB78', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Export Complete!
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Your data has been exported successfully.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {}}
                >
                  Download File
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleNewExport}
                >
                  New Export
                </Button>
              </Box>
            </Box>
          );
        }

        if (exporting) {
          return (
            <Box sx={{ py: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Exporting Data...
              </Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={exportProgress} />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                {exportProgress}% complete
              </Typography>
            </Box>
          );
        }

        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your export settings before proceeding.
            </Alert>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Export Summary
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <DataIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Data Type"
                    secondary={dataTypes.find(d => d.id === selectedDataType)?.label}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {exportFormats.find(f => f.id === selectedFormat)?.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary="Format"
                    secondary={exportFormats.find(f => f.id === selectedFormat)?.label}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date Range"
                    secondary={`${format(dateRange.startDate, 'MMM dd, yyyy')} - ${format(dateRange.endDate, 'MMM dd, yyyy')}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Selected Fields"
                    secondary={selectedFields.length > 0 ? selectedFields.join(', ') : 'All fields'}
                  />
                </ListItem>
                
                {exportOptions.scheduleExport && (
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Schedule"
                      secondary="Daily export"
                    />
                  </ListItem>
                )}
                
                {exportOptions.emailNotification && (
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notification"
                      secondary={exportOptions.emailAddress}
                    />
                  </ListItem>
                )}
              </List>
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
          Export Data
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Export your data in various formats for analysis or reporting
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {getStepContent(index)}
                
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleExport : handleNext}
                      disabled={
                        (index === 0 && !selectedDataType) ||
                        (index === 1 && !selectedFormat) ||
                        (index === 2 && selectedFields.length === 0) ||
                        exporting
                      }
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      {index === steps.length - 1 ? 'Export Data' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you're finished</Typography>
            <Button onClick={handleNewExport} sx={{ mt: 1, mr: 1 }}>
              New Export
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default ExportData;