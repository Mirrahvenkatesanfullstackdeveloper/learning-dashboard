const express = require('express');
const router = express.Router();

router.get('/overview', (req, res) => {
  res.json({ 
    success: true,
    message: 'Analytics overview',
    data: {
      users: { total: 1250, active: 890, new: 45 },
      courses: { total: 24, published: 18, enrollments: 3450 },
      assignments: { total: 156, pending: 23, graded: 98 },
      revenue: { total: 45670, monthly: 8230 }
    }
  });
});

router.get('/users', (req, res) => {
  res.json({ 
    success: true,
    data: {
      growth: [
        { month: 'Jan', count: 120 },
        { month: 'Feb', count: 145 },
        { month: 'Mar', count: 168 }
      ],
      byRole: [
        { _id: 'learner', count: 980 },
        { _id: 'educator', count: 45 },
        { _id: 'coordinator', count: 5 }
      ],
      retention: { active: 890, total: 1250, rate: 71.2 }
    }
  });
});

router.get('/courses', (req, res) => {
  res.json({ 
    success: true,
    data: {
      topCourses: [
        { title: 'React Basics', enrollments: 450, rating: 4.8 },
        { title: 'Node.js', enrollments: 380, rating: 4.6 }
      ],
      categoryDistribution: [
        { _id: 'programming', count: 12 },
        { _id: 'design', count: 6 }
      ]
    }
  });
});

router.get('/revenue', (req, res) => {
  res.json({ 
    success: true,
    data: {
      overTime: [
        { month: 'Jan', total: 12000 },
        { month: 'Feb', total: 14500 }
      ],
      byMethod: [
        { _id: 'credit_card', total: 35000 },
        { _id: 'paypal', total: 12000 }
      ],
      mrr: 8230
    }
  });
});

router.get('/performance', (req, res) => {
  res.json({ 
    success: true,
    data: {
      averageGrades: [
        { courseTitle: 'React Basics', avgPercentage: 85 },
        { courseTitle: 'Node.js', avgPercentage: 82 }
      ],
      gradeDistribution: [
        { _id: 'A', count: 45 },
        { _id: 'B', count: 78 }
      ]
    }
  });
});

router.post('/export', (req, res) => {
  const { format = 'json' } = req.body;
  
  if (format === 'json') {
    res.json({ 
      success: true,
      message: 'Data exported successfully',
      data: { exported: true, timestamp: new Date() }
    });
  } else if (format === 'csv') {
    res.header('Content-Type', 'text/csv');
    res.attachment(`export-${Date.now()}.csv`);
    res.send('id,name,email\n1,John,john@example.com');
  }
});

module.exports = router;