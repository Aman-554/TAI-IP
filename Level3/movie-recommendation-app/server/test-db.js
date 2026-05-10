// server/test-db.js
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing MongoDB connection...');
  console.log(`URI: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      tlsAllowInvalidCertificates: true,
    });
    console.log('✅ Connection successful!');
    console.log(`Connected to: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();