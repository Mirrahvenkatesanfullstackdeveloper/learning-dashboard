const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Study plans routes working',
    data: []
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    success: true,
    message: `Get study plan ${req.params.id}`,
    data: { id: req.params.id }
  });
});

router.post('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Study plan created',
    data: req.body
  });
});

router.put('/:id', (req, res) => {
  res.json({ 
    success: true,
    message: `Study plan ${req.params.id} updated`,
    data: { id: req.params.id, ...req.body }
  });
});

router.put('/:id/courses/:courseId', (req, res) => {
  res.json({ 
    success: true,
    message: `Course progress updated in study plan ${req.params.id}`,
    data: { 
      studyPlanId: req.params.id,
      courseId: req.params.courseId,
      progress: req.body.progress || 50
    }
  });
});

router.post('/:id/share', (req, res) => {
  res.json({ 
    success: true,
    message: `Study plan ${req.params.id} shared`,
    data: { sharedWith: req.body.userId }
  });
});

router.post('/:id/bookmark', (req, res) => {
  res.json({ 
    success: true,
    message: `Study plan ${req.params.id} bookmarked`,
    data: { bookmarked: true }
  });
});

router.delete('/:id', (req, res) => {
  res.json({ 
    success: true,
    message: `Study plan ${req.params.id} deleted`
  });
});

module.exports = router;