const express = require('express');
const router = express.Router();

// Get matched patterns
router.get('/', (req, res) => {
  const matches = [
    { digit: 3, frequency: 45, lastOccurrence: '2 seconds ago' },
    { digit: 7, frequency: 38, lastOccurrence: '5 seconds ago' },
    { digit: 1, frequency: 32, lastOccurrence: '8 seconds ago' },
    { digit: 9, frequency: 28, lastOccurrence: '12 seconds ago' }
  ];
  
  res.json({
    success: true,
    data: matches,
    totalMatches: matches.length,
    timestamp: new Date()
  });
});

module.exports = router;
