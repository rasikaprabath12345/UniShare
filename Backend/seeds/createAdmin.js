/**
 * ============================================
 * CREATE ADMIN USER SEED SCRIPT
 * ============================================
 * 
 * Usage:
 * node seeds/createAdmin.js
 * 
 * This script creates a sample admin user with the following credentials:
 * Email: admin@my.sliit.lk
 * Password: Admin@12345
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/Usermanagement');

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/unishare';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@my.sliit.lk' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: 'admin@my.sliit.lk',
      password: 'Admin@12345',
      studentId: 'ADMIN001',
      faculty: 'IT',
      academicYear: 'Year 4',
      semester: 1,
      role: 'admin',
      isActive: true,
    });

    console.log('\n✓ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@my.sliit.lk');
    console.log('🔐 Password: Admin@12345');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✓ Connection closed');
  } catch (error) {
    console.error('✗ Error creating admin user:');
    console.error('  ', error.message);
    process.exit(1);
  }
}

createAdmin();
