const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace black
  content = content.replace(/bg-black/g, 'bg-gray-900');
  content = content.replace(/text-black/g, 'text-gray-900');
  content = content.replace(/border-black/g, 'border-gray-900');

  // Replace dark
  content = content.replace(/bg-dark/g, 'bg-gray-900');
  content = content.replace(/text-dark/g, 'text-gray-900');
  content = content.replace(/border-dark/g, 'border-gray-900');
  content = content.replace(/shadow-dark/g, 'shadow-gray-900');

  // Replace red (errors/danger)
  content = content.replace(/bg-red-/g, 'bg-gray-');
  content = content.replace(/text-red-/g, 'text-gray-');
  content = content.replace(/border-red-/g, 'border-gray-');
  content = content.replace(/shadow-red-/g, 'shadow-gray-');

  // Replace yellow/orange/blue if any exist
  content = content.replace(/bg-yellow-/g, 'bg-gray-');
  content = content.replace(/text-yellow-/g, 'text-gray-');
  content = content.replace(/bg-orange-/g, 'bg-gray-');
  content = content.replace(/text-orange-/g, 'text-gray-');
  content = content.replace(/bg-blue-/g, 'bg-gray-');
  content = content.replace(/text-blue-/g, 'text-gray-');
  content = content.replace(/bg-indigo-/g, 'bg-gray-');
  content = content.replace(/text-indigo-/g, 'text-gray-');
  content = content.replace(/bg-purple-/g, 'bg-gray-');
  content = content.replace(/text-purple-/g, 'text-gray-');
  content = content.replace(/bg-pink-/g, 'bg-gray-');
  content = content.replace(/text-pink-/g, 'text-gray-');
  content = content.replace(/bg-emerald-/g, 'bg-primary/'); // emerald was used as a replacement for indigo earlier, let's map it to primary
  content = content.replace(/text-emerald-/g, 'text-primary/');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('./src');
replaceInFile('./App.tsx');
