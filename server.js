const express = require('express');
const cors = require('cors');
const { searchProducts } = require('./services/mockScraper');
const { initDb, addToWishlist, getWishlist, removeFromWishlist } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
initDb();

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

const otps = {}; // Temporary memory store for OTPs

// Auth endpoints
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) return res.status(400).json({ error: 'Valid 10-digit phone required' });
  
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otps[phone] = { otp, expires: Date.now() + 5 * 60000 };
  
  console.log(`\n========================================`);
  console.log(`🔑 SECURE OTP FOR ${phone}: ${otp}`);
  console.log(`========================================\n`);
  
  res.json({ 
    message: 'OTP generated successfully',
    otp: otp // Returning OTP directly for simulation
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  
  // Test bypass for easy development
  if (otp === '1234') {
    return res.json({ success: true, token: `mock-jwt-token-${phone}` });
  }
  
  const record = otps[phone];
  
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ error: 'OTP expired or a new one needs to be requested' });
  }
  if (record.otp === otp) {
    delete otps[phone];
    res.json({ success: true, token: `mock-jwt-token-${phone}` });
  } else {
    res.status(400).json({ error: 'Invalid OTP entered' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await searchProducts(q);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Wishlist endpoints
app.get('/api/wishlist', async (req, res) => {
  try {
    const items = await getWishlist();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist', async (req, res) => {
  const product = req.body;
  try {
    await addToWishlist(product);
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

app.delete('/api/wishlist/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await removeFromWishlist(id);
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
