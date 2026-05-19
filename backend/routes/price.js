const express = require('express');
const router = express.Router();

// Get live price
router.get('/', (req, res) => {
  const price = (Math.random() * 100 + 10).toFixed(5);
  
  res.json({
    success: true,
    price: `$${price}`,
    timestamp: new Date()
  });
});

module.exports = router;
