const express = require('express');
const router = express.Router();

// Mock discussions
const mockDiscussions = [
  {
    id: 1,
    title: 'Welcome to the forum',
    content: 'Introduce yourself here',
    author: { id: 1, name: 'Admin' },
    replies: 5,
    views: 120,
    createdAt: new Date()
  }
];

router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Discussions routes working',
    data: mockDiscussions
  });
});

router.get('/:id', (req, res) => {
  const discussion = mockDiscussions.find(d => d.id === parseInt(req.params.id));
  res.json({ 
    success: true,
    data: discussion || { 
      id: req.params.id,
      title: 'Sample Discussion',
      content: 'This is a sample discussion',
      comments: []
    }
  });
});

router.post('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Discussion created',
    data: { id: Date.now(), ...req.body }
  });
});

router.put('/:id', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} updated`,
    data: { id: req.params.id, ...req.body }
  });
});

router.delete('/:id', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} deleted`
  });
});

router.post('/:id/like', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} liked`,
    data: { liked: true, count: 10 }
  });
});

router.post('/:id/bookmark', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} bookmarked`,
    data: { bookmarked: true }
  });
});

router.put('/:id/pin', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} pinned`,
    data: { pinned: true }
  });
});

router.put('/:id/lock', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} locked`,
    data: { locked: true }
  });
});

router.post('/:id/report', (req, res) => {
  res.json({ 
    success: true,
    message: `Discussion ${req.params.id} reported`
  });
});

module.exports = router;