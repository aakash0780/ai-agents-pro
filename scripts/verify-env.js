#!/usr/bin/env node

// Script to verify .env file configuration
import { readFileSync, existsSync } from 'fs';

console.log('🔍 Verifying .env file...\n');

const envPath = '.env';

if (!existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('\n📝 Create a .env file with:');
  console.log(`
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
VITE_API_URL=http://localhost:3001/api
`);
  process.exit(1);
}

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  
  console.log('📋 Found .env file with the following variables:\n');
  
  let hasDatabaseUrl = false;
  let hasJwtSecret = false;
  let hasPort = false;
  let hasViteApiUrl = false;
  let hasPlaceholders = false;
  
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    
    if (key.trim() === 'DATABASE_URL') {
      hasDatabaseUrl = true;
      if (value.includes('username:password') || value.includes('your_')) {
        hasPlaceholders = true;
        console.log(`  ⚠️  ${key.trim()}: ${value.substring(0, 50)}... (has placeholders!)`);
      } else {
        console.log(`  ✅ ${key.trim()}: ${value.substring(0, 50)}...`);
      }
    } else if (key.trim() === 'JWT_SECRET') {
      hasJwtSecret = true;
      if (value.includes('your-secret') || value.length < 20) {
        console.log(`  ⚠️  ${key.trim()}: ${value.substring(0, 20)}... (should be longer/random)`);
      } else {
        console.log(`  ✅ ${key.trim()}: ${value.substring(0, 20)}...`);
      }
    } else if (key.trim() === 'PORT') {
      hasPort = true;
      console.log(`  ✅ ${key.trim()}: ${value}`);
    } else if (key.trim() === 'VITE_API_URL') {
      hasViteApiUrl = true;
      console.log(`  ✅ ${key.trim()}: ${value}`);
    } else {
      console.log(`  ℹ️  ${key.trim()}: (custom variable)`);
    }
  });
  
  console.log('\n📊 Summary:');
  
  if (!hasDatabaseUrl) {
    console.error('  ❌ DATABASE_URL is missing!');
  } else if (hasPlaceholders) {
    console.warn('  ⚠️  DATABASE_URL has placeholder values - update with real credentials');
  } else {
    console.log('  ✅ DATABASE_URL is configured');
  }
  
  if (!hasJwtSecret) {
    console.warn('  ⚠️  JWT_SECRET is missing (will use default)');
  } else {
    console.log('  ✅ JWT_SECRET is set');
  }
  
  if (!hasPort) {
    console.log('  ℹ️  PORT not set (will use default: 3001)');
  } else {
    console.log('  ✅ PORT is set');
  }
  
  if (!hasViteApiUrl) {
    console.log('  ℹ️  VITE_API_URL not set (will use default: http://localhost:3001/api)');
  } else {
    console.log('  ✅ VITE_API_URL is set');
  }
  
  console.log('\n');
  
  if (!hasDatabaseUrl || hasPlaceholders) {
    console.error('❌ Please fix the issues above before running Prisma commands');
    process.exit(1);
  }
  
  console.log('✅ .env file looks good!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure PostgreSQL is running');
  console.log('   2. Create database: createdb ai_agents_db (or your database name)');
  console.log('   3. Run: npx prisma migrate dev --name init');
  
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

