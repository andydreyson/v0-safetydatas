#!/usr/bin/env node
/**
 * SafetyDatas Pre-Deployment Check Script
 * Verifies all required environment variables and configurations before deployment
 * 
 * Usage: node scripts/pre-deploy-check.js [--strict]
 * --strict: Exit with error code if any warnings exist
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Configuration
const PROJECT_NAME = 'v0-safetydatas';
const REQUIRED_ENV_VARS = [
  { name: 'DATABASE_URL', category: 'Database', sensitive: true },
  { name: 'OPENAI_API_KEY', category: 'AI', sensitive: true },
  { name: 'NEXTAUTH_SECRET', category: 'Auth', sensitive: true },
  { name: 'NEXT_PUBLIC_BASE_URL', category: 'App', sensitive: false },
  { name: 'STRIPE_SECRET_KEY', category: 'Payments', sensitive: true },
  { name: 'STRIPE_PUBLISHABLE_KEY', category: 'Payments', sensitive: false },
  { name: 'STRIPE_WEBHOOK_SECRET', category: 'Payments', sensitive: true }
];

const OPTIONAL_ENV_VARS = [
  { name: 'NEXTAUTH_URL', category: 'Auth', sensitive: false },
  { name: 'VERCEL_ENV', category: 'Vercel', sensitive: false },
  { name: 'VERCEL_URL', category: 'Vercel', sensitive: false },
  { name: 'KV_URL', category: 'Cache', sensitive: true },
  { name: 'KV_REST_API_URL', category: 'Cache', sensitive: false },
  { name: 'KV_REST_API_TOKEN', category: 'Cache', sensitive: true },
  { name: 'SENTRY_DSN', category: 'Monitoring', sensitive: false }
];

// State tracking
const results = {
  passed: [],
  warnings: [],
  errors: [],
  missing: [],
  configured: []
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(`${colors.bold}${title}`, colors.cyan);
  console.log('='.repeat(60));
}

function printSection(title) {
  console.log('\n' + '-'.repeat(40));
  log(`${colors.bold}${title}`, colors.blue);
  console.log('-'.repeat(40));
}

function checkLocalEnvFile() {
  printSection('Local Environment File');
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    results.warnings.push('No .env.local file found');
    log('⚠️  .env.local not found', colors.yellow);
    return false;
  }
  
  log('✅ .env.local file exists', colors.green);
  
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  log(`   Found ${lines.length} environment variable definitions`);
  return true;
}

function checkVercelProject() {
  printSection('Vercel Project Configuration');
  
  try {
    const vercelJsonPath = path.join(process.cwd(), '.vercel', 'project.json');
    
    if (!fs.existsSync(vercelJsonPath)) {
      results.warnings.push('No Vercel project configuration found');
      log('⚠️  Not linked to Vercel project', colors.yellow);
      log('   Run: npx vercel link', colors.cyan);
      return false;
    }
    
    const projectConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    log(`✅ Linked to Vercel project: ${projectConfig.projectId}`, colors.green);
    
    return true;
  } catch (error) {
    results.errors.push(`Failed to read Vercel config: ${error.message}`);
    log(`❌ Error reading Vercel configuration: ${error.message}`, colors.red);
    return false;
  }
}

async function checkVercelEnvVars() {
  printSection('Vercel Environment Variables');
  
  try {
    // Try to fetch environment variables from Vercel CLI
    const output = execSync('npx vercel env ls', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    log('✅ Successfully fetched Vercel environment variables', colors.green);
    
    // Parse the output to check which variables are configured
    const configuredVars = new Set();
    const lines = output.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\w+)\s+/);
      if (match) {
        configuredVars.add(match[1]);
      }
    }
    
    // Check required variables
    for (const envVar of REQUIRED_ENV_VARS) {
      if (configuredVars.has(envVar.name)) {
        results.configured.push(envVar.name);
        log(`  ✅ ${envVar.name} (${envVar.category})`, colors.green);
      } else {
        results.missing.push(envVar);
        log(`  ❌ ${envVar.name} (${envVar.category}) - MISSING`, colors.red);
      }
    }
    
    // Check optional variables
    for (const envVar of OPTIONAL_ENV_VARS) {
      if (configuredVars.has(envVar.name)) {
        results.configured.push(envVar.name);
        log(`  ✅ ${envVar.name} (${envVar.category}) - Optional`, colors.green);
      } else {
        log(`  ⚠️  ${envVar.name} (${envVar.category}) - Optional, not set`, colors.yellow);
      }
    }
    
    return configuredVars;
  } catch (error) {
    results.warnings.push('Could not fetch Vercel env vars. Make sure you are logged in.');
    log('⚠️  Could not fetch Vercel environment variables', colors.yellow);
    log('   Make sure you are logged in: npx vercel login', colors.cyan);
    
    // Mark all as unknown
    for (const envVar of REQUIRED_ENV_VARS) {
      results.missing.push(envVar);
      log(`  ❓ ${envVar.name} (${envVar.category}) - Unknown`, colors.yellow);
    }
    
    return new Set();
  }
}

function checkLocalEnvVars() {
  printSection('Local Environment Variables');
  
  const envPath = path.join(process.cwd(), '.env.local');
  let localEnvVars = {};
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^([A-Z_]+)=(.+)$/);
      if (match) {
        localEnvVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  }
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (localEnvVars[envVar.name]) {
      let value = localEnvVars[envVar.name];
      
      // Mask sensitive values
      if (envVar.sensitive && value.length > 8) {
        value = value.substring(0, 4) + '****' + value.substring(value.length - 4);
      }
      
      log(`  ✅ ${envVar.name} = ${value} (${envVar.category})`, colors.green);
    } else {
      log(`  ❌ ${envVar.name} - NOT SET (${envVar.category})`, colors.red);
    }
  }
  
  return localEnvVars;
}

function checkDatabaseConnection() {
  printSection('Database Connection Test');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    results.warnings.push('Cannot test database connection: DATABASE_URL not set in environment');
    log('⚠️  Skipping database test - DATABASE_URL not in current environment', colors.yellow);
    log('   To test locally, ensure DATABASE_URL is exported in your shell', colors.cyan);
    return false;
  }
  
  try {
    // Simple regex validation
    const dbUrlPattern = /^postgres(ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+/;
    
    if (!dbUrlPattern.test(databaseUrl)) {
      results.warnings.push('DATABASE_URL format appears invalid');
      log('⚠️  DATABASE_URL format appears invalid', colors.yellow);
      return false;
    }
    
    log('✅ DATABASE_URL format appears valid', colors.green);
    
    // Check if it's a Prisma Postgres URL
    if (databaseUrl.includes('prisma.io') || databaseUrl.includes('neon.tech')) {
      log('✅ Detected managed Postgres provider', colors.green);
    }
    
    return true;
  } catch (error) {
    results.errors.push(`Database validation error: ${error.message}`);
    log(`❌ Database validation error: ${error.message}`, colors.red);
    return false;
  }
}

function checkOpenAIConnection() {
  printSection('OpenAI API Configuration');
  
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    results.warnings.push('Cannot test OpenAI: OPENAI_API_KEY not set in environment');
    log('⚠️  Skipping OpenAI test - OPENAI_API_KEY not in current environment', colors.yellow);
    return false;
  }
  
  if (openaiKey.startsWith('sk-proj-') || openaiKey.startsWith('sk-')) {
    log('✅ OPENAI_API_KEY format appears valid', colors.green);
    log(`   Key prefix: ${openaiKey.substring(0, 10)}...`, colors.cyan);
    return true;
  } else {
    results.warnings.push('OPENAI_API_KEY format appears invalid');
    log('⚠️  OPENAI_API_KEY format appears invalid', colors.yellow);
    return false;
  }
}

function checkStripeConfiguration() {
  printSection('Stripe Configuration');
  
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishable = process.env.STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    results.warnings.push('STRIPE_SECRET_KEY not configured');
    log('❌ STRIPE_SECRET_KEY - NOT SET', colors.red);
  } else if (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_')) {
    const mode = stripeKey.startsWith('sk_live_') ? 'LIVE' : 'TEST';
    log(`✅ STRIPE_SECRET_KEY configured (${mode} mode)`, colors.green);
  } else {
    results.warnings.push('STRIPE_SECRET_KEY format appears invalid');
    log('⚠️  STRIPE_SECRET_KEY format appears invalid', colors.yellow);
  }
  
  if (!stripePublishable) {
    results.warnings.push('STRIPE_PUBLISHABLE_KEY not configured');
    log('❌ STRIPE_PUBLISHABLE_KEY - NOT SET', colors.red);
  } else if (stripePublishable.startsWith('pk_live_') || stripePublishable.startsWith('pk_test_')) {
    log('✅ STRIPE_PUBLISHABLE_KEY configured', colors.green);
  } else {
    results.warnings.push('STRIPE_PUBLISHABLE_KEY format appears invalid');
    log('⚠️  STRIPE_PUBLISHABLE_KEY format appears invalid', colors.yellow);
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    results.warnings.push('STRIPE_WEBHOOK_SECRET not configured (needed for webhooks)');
    log('⚠️  STRIPE_WEBHOOK_SECRET - NOT SET (needed for webhooks)', colors.yellow);
  } else {
    log('✅ STRIPE_WEBHOOK_SECRET configured', colors.green);
  }
}

function checkAuthConfiguration() {
  printSection('Authentication Configuration');
  
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  
  if (!nextAuthSecret) {
    results.missing.push({ name: 'NEXTAUTH_SECRET', category: 'Auth', sensitive: true });
    log('❌ NEXTAUTH_SECRET - NOT SET', colors.red);
    log('   Generate with: openssl rand -base64 32', colors.cyan);
  } else if (nextAuthSecret.length < 32) {
    results.warnings.push('NEXTAUTH_SECRET appears too short (should be at least 32 chars)');
    log('⚠️  NEXTAUTH_SECRET appears too short (should be at least 32 characters)', colors.yellow);
  } else {
    log('✅ NEXTAUTH_SECRET configured', colors.green);
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    results.missing.push({ name: 'NEXT_PUBLIC_BASE_URL', category: 'App', sensitive: false });
    log('❌ NEXT_PUBLIC_BASE_URL - NOT SET', colors.red);
    log('   Set to your production URL, e.g., https://safetydatas.com', colors.cyan);
  } else {
    try {
      new URL(baseUrl);
      log(`✅ NEXT_PUBLIC_BASE_URL = ${baseUrl}`, colors.green);
    } catch {
      results.warnings.push('NEXT_PUBLIC_BASE_URL is not a valid URL');
      log(`⚠️  NEXT_PUBLIC_BASE_URL = ${baseUrl} (invalid URL format)`, colors.yellow);
    }
  }
}

function checkBuildConfiguration() {
  printSection('Build Configuration');
  
  // Check next.config.mjs
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  const nextConfigJsPath = path.join(process.cwd(), 'next.config.js');
  
  if (fs.existsSync(nextConfigPath) || fs.existsSync(nextConfigJsPath)) {
    log('✅ Next.js config file exists', colors.green);
  } else {
    results.warnings.push('No Next.js config file found');
    log('⚠️  No next.config.mjs or next.config.js found', colors.yellow);
  }
  
  // Check package.json for build script
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts?.['vercel-build']) {
    log('✅ vercel-build script configured', colors.green);
  } else if (packageJson.scripts?.build) {
    log('✅ build script configured', colors.green);
    results.warnings.push('Consider adding vercel-build script for Prisma generation');
    log('⚠️  Consider adding vercel-build script for Prisma generation', colors.yellow);
    log('   "vercel-build": "prisma generate && next build"', colors.cyan);
  }
  
  // Check Prisma schema
  const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (fs.existsSync(prismaSchemaPath)) {
    log('✅ Prisma schema exists', colors.green);
  } else {
    results.errors.push('Prisma schema not found');
    log('❌ Prisma schema not found', colors.red);
  }
}

function printSummary() {
  printHeader('DEPLOYMENT CHECK SUMMARY');
  
  const totalRequired = REQUIRED_ENV_VARS.length;
  const configuredRequired = REQUIRED_ENV_VARS.filter(v => 
    results.configured.includes(v.name)
  ).length;
  
  log(`Environment Variables: ${configuredRequired}/${totalRequired} required configured`, 
    configuredRequired === totalRequired ? colors.green : colors.yellow);
  
  if (results.missing.length > 0) {
    console.log('\n' + colors.bold + 'Missing Required Variables:' + colors.reset);
    for (const missing of results.missing) {
      log(`  ❌ ${missing.name} (${missing.category})`, colors.red);
    }
  }
  
  if (results.warnings.length > 0) {
    console.log('\n' + colors.bold + 'Warnings:' + colors.reset);
    for (const warning of [...new Set(results.warnings)]) {
      log(`  ⚠️  ${warning}`, colors.yellow);
    }
  }
  
  if (results.errors.length > 0) {
    console.log('\n' + colors.bold + 'Errors:' + colors.reset);
    for (const error of results.errors) {
      log(`  ❌ ${error}`, colors.red);
    }
  }
  
  // Final verdict
  console.log('\n' + '='.repeat(60));
  
  if (results.errors.length === 0 && results.missing.length === 0) {
    log('✅ READY FOR DEPLOYMENT', colors.green);
    log('All required checks passed!', colors.green);
    console.log('='.repeat(60));
    return 0;
  } else if (results.errors.length === 0) {
    log('⚠️  DEPLOYMENT BLOCKED', colors.yellow);
    log(`Missing ${results.missing.length} required environment variable(s)`, colors.yellow);
    console.log('\n' + colors.cyan + 'To add missing variables to Vercel:' + colors.reset);
    console.log('  npx vercel env add <VARIABLE_NAME>');
    console.log('\n' + colors.cyan + 'Or use the Vercel dashboard:' + colors.reset);
    console.log('  https://vercel.com/dashboard');
    console.log('='.repeat(60));
    return 1;
  } else {
    log('❌ DEPLOYMENT BLOCKED - ERRORS FOUND', colors.red);
    console.log('='.repeat(60));
    return 1;
  }
}

function printNextSteps() {
  console.log('\n');
  printHeader('NEXT STEPS');
  
  if (results.missing.length > 0) {
    log('1. Add missing environment variables:', colors.cyan);
    console.log('');
    for (const missing of results.missing) {
      console.log(`   npx vercel env add ${missing.name}`);
    }
    console.log('');
  }
  
  log('2. Deploy to Vercel:', colors.cyan);
  console.log('   npx vercel --prod');
  console.log('');
  
  log('3. After deployment, verify:', colors.cyan);
  console.log('   - Visit /api/health endpoint');
  console.log('   - Test authentication flow');
  console.log('   - Test Stripe payment flow (use test mode)');
  console.log('   - Test OpenAI PDF analysis');
  console.log('');
  
  log('4. Monitor deployment:', colors.cyan);
  console.log('   npx vercel logs --all');
  console.log('');
}

// Main execution
async function main() {
  const isStrict = process.argv.includes('--strict');
  
  printHeader(`SafetyDatas Deployment Check v1.0`);
  log(`Project: ${PROJECT_NAME}`, colors.cyan);
  log(`Time: ${new Date().toISOString()}`, colors.cyan);
  log(`Mode: ${isStrict ? 'STRICT' : 'NORMAL'}`, colors.cyan);
  
  // Run all checks
  checkLocalEnvFile();
  checkVercelProject();
  await checkVercelEnvVars();
  checkLocalEnvVars();
  checkDatabaseConnection();
  checkOpenAIConnection();
  checkStripeConfiguration();
  checkAuthConfiguration();
  checkBuildConfiguration();
  
  // Print summary
  const exitCode = printSummary();
  
  // Print next steps
  if (exitCode !== 0 || results.warnings.length > 0) {
    printNextSteps();
  }
  
  // Strict mode: warnings become errors
  if (isStrict && results.warnings.length > 0) {
    console.log('\n' + colors.red + 'Strict mode: Exiting with error due to warnings' + colors.reset);
    process.exit(1);
  }
  
  process.exit(exitCode);
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
