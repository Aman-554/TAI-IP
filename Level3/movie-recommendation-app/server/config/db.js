// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if MONGODB_URI exists
  if (!process.env.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB Atlas...');
  console.log(`📡 Connection string: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')}`); // Hide password in logs

  try {
    // Connection options to fix SSL error
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip IPv6
      tls: true,
      tlsAllowInvalidCertificates: true, // This fixes the SSL error
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      retryReads: true,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🔒 SSL/TLS: Enabled (with certificate validation disabled for development)`);
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.error('2. Verify username and password are correct');
    console.error('3. Check if the database user has proper permissions');
    console.error('4. Try using local MongoDB instead: MONGODB_URI=mongodb://localhost:27017/movie_recommendation');
    
    // Don't exit process on connection error in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('\n⚠️ Continuing without database connection (some features will not work)');
      return null;
    }
  }
};

module.exports = connectDB;