require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

console.log('🚀 Starting simple test server...');
console.log('📁 Current directory:', __dirname);
console.log('🔍 Checking MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Not found');

const app = express();

app.get('/api/health', (req, res) => {
  console.log('📡 Health check endpoint hit!');
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = 5000;

console.log('⏳ Connecting to MongoDB...');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on:`);
      console.log(`   ➜ http://localhost:${PORT}/api/health`);
      console.log(`   ➜ http://127.0.0.1:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });