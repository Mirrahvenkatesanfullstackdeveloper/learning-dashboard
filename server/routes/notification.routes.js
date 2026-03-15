const express = require('express');
const router = express.Router();

// Mock notifications
const mockNotifications = [
  { 
    id: 1, 
    type: 'info', 
    title: 'Welcome!', 
    message: 'Welcome to the platform', 
    read: false,
    createdAt: new Date()
  },
  { 
    id: 2, 
    type: 'success', 
    title: 'Assignment Graded', 
    message: 'Your React assignment has been graded', 
    read: true,
    createdAt: new Date(Date.now() - 86400000)
  }
];

router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Notifications routes working',
    data: mockNotifications,
    unread: mockNotifications.filter(n => !n.read).length
  });
});

router.get('/unread/count', (req, res) => {
  res.json({ 
    success: true,
    data: { count: mockNotifications.filter(n => !n.read).length }
  });
});

router.get('/:id', (req, res) => {
  const notification = mockNotifications.find(n => n.id === parseInt(req.params.id));
  res.json({ 
    success: true,
    data: notification || { id: req.params.id }
  });
});

router.put('/:id/read', (req, res) => {
  res.json({ 
    success: true,
    message: `Notification ${req.params.id} marked as read`,
    data: { id: req.params.id, read: true }
  });
});

router.put('/read-all', (req, res) => {
  res.json({ 
    success: true,
    message: 'All notifications marked as read'
  });
});

router.put('/:id/archive', (req, res) => {
  res.json({ 
    success: true,
    message: `Notification ${req.params.id} archived`
  });
});

router.delete('/:id', (req, res) => {
  res.json({ 
    success: true,
    message: `Notification ${req.params.id} deleted`
  });
});

router.get('/preferences', (req, res) => {
  res.json({ 
    success: true,
    data: { email: true, push: true, sms: false }
  });
});

router.put('/preferences', (req, res) => {
  res.json({ 
    success: true,
    message: 'Preferences updated',
    data: req.body
  });
});

module.exports = router;