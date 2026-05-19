const express = require('express');
const router = express.Router();

// Get current digit probabilities
router.get('/', (req, res) => {
  const probabilities = {};
  for (let i = 0; i < 10; i++) {
    probabilities[i] = (Math.random() * 10 + 4.1).toFixed(1);
  }
  
  res.json({
    success: true,
    data: probabilities,
    timestamp: new Date(),
    range: { min: '4.1%', max: '15.0%' }
  });
});

module.exports = router;
