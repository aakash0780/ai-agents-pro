#!/usr/bin/env node

// Quick script to check if .env file exists and has DATABASE_URL
import { readFileSync, existsSync } from 'fs';

const envPath = '.env';

if (!existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('\n📝 Create a .env file with the following content:');
  console.log(`
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
VITE_API_URL=http://localhost:3001/api
`);
  process.exit(1);
}

try {
  const envContent = readFileSync(envPath, 'utf-8');
  
  if (!envContent.includes('DATABASE_URL')) {
    console.error('❌ DATABASE_URL not found in .env file!');
    console.log('\n📝 Make sure your .env file contains:');
    console.log('DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"');
    process.exit(1);
  }
  
  if (envContent.includes('postgresql://username:password')) {
    console.warn('⚠️  WARNING: DATABASE_URL still has placeholder values!');
    console.log('Please edit .env file and replace with your actual PostgreSQL credentials');
    process.exit(1);
  }
  
  console.log('✅ .env file found and DATABASE_URL is set!');
  console.log('You can now run: npx prisma generate');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

