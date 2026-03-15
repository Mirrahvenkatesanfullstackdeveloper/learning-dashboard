import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  Link,
  IconButton,      // Added missing IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  const faqCategories = [
    { id: 'general', label: 'General', icon: <HelpIcon /> },
    { id: 'courses', label: 'Courses', icon: <SchoolIcon /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { id: 'payments', label: 'Payments', icon: <PaymentIcon /> },
    { id: 'account', label: 'Account', icon: <AccountIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
  ];

  const faqData = {
    general: [
      {
        question: 'What is Learning Dashboard?',
        answer: 'Learning Dashboard is a comprehensive learning management system that provides courses, assignments, study plans, and analytics for learners, educators, and coordinators.',
      },
      {
        question: 'How do I get started?',
        answer: 'Simply create an account, browse our course catalog, and enroll in courses that interest you. You can also create study plans to organize your learning journey.',
      },
      {
        question: 'Is there a mobile app?',
        answer: 'Yes, Learning Dashboard is fully responsive and works on all devices. You can access the platform through any web browser on your mobile device.',
      },
      {
        question: 'How do I contact support?',
        answer: 'You can reach our support team through the Contact page, live chat, or email at support@learningdashboard.com. We typically respond within 24 hours.',
      },
    ],
    courses: [
      {
        question: 'How do I enroll in a course?',
        answer: 'Browse the course catalog, select a course you\'re interested in, and click the "Enroll Now" button. Complete the payment process to gain access to the course materials.',
      },
      {
        question: 'Can I get a refund for a course?',
        answer: 'Yes, we offer a 30-day money-back guarantee for all courses. If you\'re not satisfied, contact support within 30 days of purchase for a full refund.',
      },
      {
        question: 'How long do I have access to a course?',
        answer: 'Once enrolled, you have lifetime access to the course materials, including all future updates.',
      },
      {
        question: 'Do I get a certificate after completing a course?',
        answer: 'Yes, upon successfully completing a course, you\'ll receive a verified certificate that you can share on LinkedIn or add to your resume.',
      },
      {
        question: 'Can I download course videos for offline viewing?',
        answer: 'Yes, our mobile app allows you to download course videos for offline viewing. On desktop, you can access course materials online only.',
      },
    ],
    assignments: [
      {
        question: 'How do I submit an assignment?',
        answer: 'Go to the assignment page, click "Submit Assignment", upload your files, add any comments, and click "Submit". Make sure to submit before the deadline.',
      },
      {
        question: 'What file types are accepted for assignments?',
        answer: 'Accepted file types include PDF, DOC, DOCX, ZIP, and various image formats. The specific requirements are listed in each assignment.',
      },
      {
        question: 'How are assignments graded?',
        answer: 'Assignments are graded by instructors using rubrics. You\'ll receive detailed feedback along with your grade.',
      },
      {
        question: 'Can I resubmit an assignment?',
        answer: 'Yes, if allowed by the instructor. Check the assignment details for the number of allowed attempts.',
      },
      {
        question: 'What happens if I submit late?',
        answer: 'Late submissions may incur a penalty depending on the course policy. Check the assignment details for late submission rules.',
      },
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payments are processed securely through industry-standard encryption. We do not store your payment information on our servers.',
      },
      {
        question: 'How do I get an invoice?',
        answer: 'Invoices are automatically generated and available in your payment history. You can download them from the Payments section.',
      },
      {
        question: 'Do you offer student discounts?',
        answer: 'Yes, we offer special pricing for students with a valid .edu email address. Contact support for more information.',
      },
      {
        question: 'Can I change my payment method?',
        answer: 'Yes, you can update your payment method in the Settings > Payments section of your account.',
      },
    ],
    account: [
      {
        question: 'How do I change my password?',
        answer: 'Go to Settings > Security, enter your current password and new password, then click "Update Password".',
      },
      {
        question: 'Can I change my email address?',
        answer: 'Yes, you can update your email in Settings > Profile. A verification email will be sent to your new address.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'To delete your account, contact support. Please note that this action is irreversible and all your data will be permanently removed.',
      },
      {
        question: 'What happens to my courses if I cancel my account?',
        answer: 'If you cancel your account, you will lose access to all courses and materials. We recommend downloading any certificates before deletion.',
      },
    ],
    security: [
      {
        question: 'How do I enable two-factor authentication?',
        answer: 'Go to Settings > Security and click "Enable Two-Factor Authentication". Follow the instructions to set it up using an authenticator app.',
      },
      {
        question: 'What should I do if I suspect unauthorized access?',
        answer: 'Immediately change your password and contact support. Enable two-factor authentication for additional security.',
      },
      {
        question: 'How do you protect my data?',
        answer: 'We use industry-standard encryption, secure servers, and regular security audits to protect your data. Read our Privacy Policy for more details.',
      },
    ],
  };

  const handleHelpfulClick = (questionId, isHelpful) => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [questionId]: isHelpful,
    }));
  };

  const filteredFAQs = () => {
    const category = faqCategories[tabValue]?.id || 'general';
    const faqs = faqData[category] || [];
    
    if (!searchQuery) return faqs;
    
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to common questions about our platform
        </Typography>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Categories Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {faqCategories.map((category, index) => (
            <Tab
              key={category.id}
              icon={category.icon}
              label={category.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* FAQ List */}
      <Paper sx={{ p: 3 }}>
        {filteredFAQs().length > 0 ? (
          filteredFAQs().map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {faq.answer}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Was this helpful?
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleHelpfulClick(index, true)}
                      color={helpfulFeedback[index] === true ? 'primary' : 'default'}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleHelpfulClick(index, false)}
                      color={helpfulFeedback[index] === false ? 'error' : 'default'}
                      sx={{ ml: 1 }}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <HelpIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No FAQs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or browse different categories
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Still Need Help */}
      <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Can't find the answer you're looking for? Our support team is here to help.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/help/contact')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Contact Support
        </Button>
      </Paper>
    </Container>
  );
};

export default FAQ;