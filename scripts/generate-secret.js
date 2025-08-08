#!/usr/bin/env node

/**
 * Generate a secure NEXTAUTH_SECRET for production use
 * Run this script to generate a new secret: node scripts/generate-secret.js
 */

const crypto = require('crypto');

// Generate a random 32-byte secret and encode it as base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('🔐 Generated NEXTAUTH_SECRET for production:');
console.log('');
console.log(secret);
console.log('');
console.log('📋 Copy this value and add it to your Vercel environment variables:');
console.log('   - Go to your Vercel project dashboard');
console.log('   - Navigate to Settings → Environment Variables');
console.log('   - Add NEXTAUTH_SECRET with the value above');
console.log('');
console.log('⚠️  Keep this secret secure and don\'t commit it to version control!');
