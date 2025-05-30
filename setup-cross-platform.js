#!/usr/bin/env node

/**
 * 🔥 Roasted MCP Cross-Platform Setup Script
 * Automatically detects OS and runs appropriate setup
 */

import os from 'os';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const platform = os.platform();

console.log('🔥 Roasted MCP Cross-Platform Setup');
console.log('===================================');
console.log(`Detected platform: ${platform}`);
console.log('');

function runSetup() {
  let command, args;
  
  if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'setup.bat'];
  } else {
    command = 'bash';
    args = ['./setup.sh'];
  }

  console.log(`Running setup for ${platform}...`);
  console.log('');

  const setupProcess = spawn(command, args, {
    stdio: 'inherit',
    cwd: __dirname
  });

  setupProcess.on('close', (code) => {
    if (code === 0) {
      console.log('');
      console.log('🎉 Setup completed successfully!');
    } else {
      console.log('');
      console.log('❌ Setup failed with exit code:', code);
      console.log('');
      console.log('Troubleshooting:');
      console.log('- Check that Node.js 18+ is installed');
      console.log('- Ensure you have internet connection for npm install');
      console.log('- Try running the platform-specific setup script directly:');
      
      if (platform === 'win32') {
        console.log('  setup.bat');
      } else {
        console.log('  ./setup.sh');
      }
    }
  });

  setupProcess.on('error', (err) => {
    console.error('❌ Failed to start setup process:', err.message);
    console.log('');
    console.log('Try running the platform-specific setup script directly:');
    
    if (platform === 'win32') {
      console.log('  setup.bat');
    } else {
      console.log('  ./setup.sh');
    }
  });
}

runSetup();