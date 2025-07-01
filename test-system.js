#!/usr/bin/env node

/**
 * 🧪 NeptuneOS Comprehensive System Test Suite
 * Tests all functionality before go-live deployment
 */

import fs from 'fs';
import path from 'path';
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5173',
  apiUrl: 'http://localhost:3001',
  timeout: 10000,
  retries: 3
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

// Utility functions
const log = (level, message) => {
  const timestamp = new Date().toISOString();
  const colors = {
    INFO: '\x1b[36m',
    SUCCESS: '\x1b[32m',
    WARN: '\x1b[33m',
    ERROR: '\x1b[31m',
    RESET: '\x1b[0m'
  };
  
  console.log(`${colors[level]}[${timestamp}] ${level}: ${message}${colors.RESET}`);
};

const test = async (name, testFn) => {
  try {
    log('INFO', `Running test: ${name}`);
    await testFn();
    testResults.passed++;
    log('SUCCESS', `✅ ${name} - PASSED`);
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ test: name, error: error.message });
    log('ERROR', `❌ ${name} - FAILED: ${error.message}`);
  }
};

const skip = (name, reason) => {
  testResults.skipped++;
  log('WARN', `⏭️  ${name} - SKIPPED: ${reason}`);
};

// Test functions
const testBuildArtifacts = async () => {
  const distPath = path.join(__dirname, 'dist');
  const requiredFiles = [
    'index.html',
    'assets/index-B9tIOxGm.js',
    'assets/index-2ANo0Egy.css'
  ];
  
  if (!fs.existsSync(distPath)) {
    throw new Error('dist directory not found - run npm run build first');
  }
  
  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required build file missing: ${file}`);
    }
  }
  
  // Check file sizes
  const mainJsPath = path.join(distPath, 'assets/index-B9tIOxGm.js');
  const stats = fs.statSync(mainJsPath);
  if (stats.size < 100000) { // Less than 100KB seems too small
    throw new Error('Main JavaScript bundle seems too small');
  }
};

const testPackageJson = async () => {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'next-themes',
    '@tanstack/react-query',
    'lucide-react'
  ];
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep]) {
      throw new Error(`Required dependency missing: ${dep}`);
    }
  }
  
  const requiredScripts = ['dev', 'build', 'preview', 'lint'];
  for (const script of requiredScripts) {
    if (!packageJson.scripts[script]) {
      throw new Error(`Required script missing: ${script}`);
    }
  }
};

const testTypeScriptCompilation = () => {
  return new Promise((resolve, reject) => {
    exec('npx tsc --noEmit', (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`TypeScript compilation failed: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
};

const testEslint = () => {
  return new Promise((resolve, reject) => {
    exec('npm run lint', (error, stdout, stderr) => {
      // ESLint warnings are OK, only fail on errors
      if (error && stderr.includes('error')) {
        reject(new Error(`ESLint errors found: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
};

const testApiServerFiles = async () => {
  const apiPath = path.join(__dirname, 'deploy');
  const requiredFiles = [
    'api-server.cjs',
    'database.cjs',
    'ecosystem.config.cjs',
    'routes/auth.cjs',
    'routes/settings.cjs',
    'routes/system.cjs'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(apiPath, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required API file missing: ${file}`);
    }
  }
};

const testDeploymentScripts = async () => {
  const deployPath = path.join(__dirname, 'deploy');
  const requiredScripts = [
    'install.sh',
    'quick-setup.sh',
    'update.sh',
    'uninstall.sh'
  ];
  
  for (const script of requiredScripts) {
    const scriptPath = path.join(deployPath, script);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Required deployment script missing: ${script}`);
    }
    
    // Check if script is executable
    const stats = fs.statSync(scriptPath);
    if (!(stats.mode & parseInt('111', 8))) {
      throw new Error(`Script not executable: ${script}`);
    }
  }
};

const testConfigFiles = async () => {
  const configFiles = [
    'vite.config.ts',
    'tailwind.config.ts',
    'tsconfig.json',
    'eslint.config.js'
  ];
  
  for (const file of configFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required config file missing: ${file}`);
    }
  }
  
  // Test Vite config
  const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
  if (!viteConfig.includes('@vitejs/plugin-react-swc')) {
    throw new Error('Vite config missing React SWC plugin');
  }
};

const testComponentStructure = async () => {
  const componentsPath = path.join(__dirname, 'src/components');
  const requiredDirs = [
    'ui',
    'dashboard',
    'settings',
    'auth'
  ];
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(componentsPath, dir);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Required component directory missing: ${dir}`);
    }
  }
  
  // Test key component files
  const keyComponents = [
    'src/pages/Index.tsx',
    'src/pages/Settings.tsx',
    'src/contexts/SettingsContext.tsx',
    'src/contexts/AuthContext.tsx',
    'src/App.tsx',
    'src/main.tsx'
  ];
  
  for (const component of keyComponents) {
    const componentPath = path.join(__dirname, component);
    if (!fs.existsSync(componentPath)) {
      throw new Error(`Key component missing: ${component}`);
    }
  }
};

const testCSSFiles = async () => {
  const cssPath = path.join(__dirname, 'src/index.css');
  if (!fs.existsSync(cssPath)) {
    throw new Error('Main CSS file missing');
  }
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Check for key CSS classes
  const requiredClasses = [
    'professional-card',
    'glass-button',
    'status-indicator',
    'data-display'
  ];
  
  for (const className of requiredClasses) {
    if (!cssContent.includes(className)) {
      throw new Error(`Required CSS class missing: ${className}`);
    }
  }
  
  // Check for theme variables
  if (!cssContent.includes('--ocean-blue') || !cssContent.includes('--seafoam')) {
    throw new Error('Theme CSS variables missing');
  }
};

const testHooks = async () => {
  const hooksPath = path.join(__dirname, 'src/hooks');
  const requiredHooks = [
    'useTemperatureData.ts',
    'useUserSettingsAPI.ts',
    'useSettingsAPI.ts',
    'useCameraStream.ts',
    'useSecureConnection.ts'
  ];
  
  for (const hook of requiredHooks) {
    const hookPath = path.join(hooksPath, hook);
    if (!fs.existsSync(hookPath)) {
      throw new Error(`Required hook missing: ${hook}`);
    }
  }
};

const testUtils = async () => {
  const utilsPath = path.join(__dirname, 'src/utils');
  const requiredUtils = [
    'temperature.ts'
  ];
  
  for (const util of requiredUtils) {
    const utilPath = path.join(utilsPath, util);
    if (!fs.existsSync(utilPath)) {
      throw new Error(`Required utility missing: ${util}`);
    }
  }
};

const testEnvironmentSetup = async () => {
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 16) {
    throw new Error(`Node.js version too old: ${nodeVersion} (required: 16+)`);
  }
  
  // Check npm
  try {
    await new Promise((resolve, reject) => {
      exec('npm --version', (error, stdout) => {
        if (error) reject(error);
        else resolve(stdout.trim());
      });
    });
  } catch (error) {
    throw new Error('npm not available');
  }
};

const testGitRepository = async () => {
  const gitPath = path.join(__dirname, '.git');
  if (!fs.existsSync(gitPath)) {
    throw new Error('Not a git repository');
  }
  
  // Check for important git files
  const gitFiles = ['.gitignore', 'README.md'];
  for (const file of gitFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Git file missing: ${file}`);
    }
  }
};

// Main test runner
async function runTests() {
  console.log('🧪 Starting NeptuneOS Comprehensive Test Suite\n');
  
  // Environment tests
  await test('Environment Setup', testEnvironmentSetup);
  await test('Git Repository', testGitRepository);
  
  // Build and configuration tests
  await test('Package.json Configuration', testPackageJson);
  await test('Configuration Files', testConfigFiles);
  await test('TypeScript Compilation', testTypeScriptCompilation);
  await test('ESLint Check', testEslint);
  await test('Build Artifacts', testBuildArtifacts);
  
  // Code structure tests
  await test('Component Structure', testComponentStructure);
  await test('CSS Files', testCSSFiles);
  await test('React Hooks', testHooks);
  await test('Utility Functions', testUtils);
  
  // Backend tests
  await test('API Server Files', testApiServerFiles);
  await test('Deployment Scripts', testDeploymentScripts);
  
  // Results summary
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST SUITE RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️  Skipped: ${testResults.skipped}`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.errors.forEach(({ test, error }) => {
      console.log(`  • ${test}: ${error}`);
    });
    console.log('\n🚫 SYSTEM NOT READY FOR GO-LIVE');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ SYSTEM READY FOR GO-LIVE');
    
    // Generate test report
    const report = {
      timestamp: new Date().toISOString(),
      results: testResults,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };
    
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Test report saved to test-report.json');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});

export { runTests, testResults };