import fs from 'fs';
import path from 'path';

const replacements = [
  { regex: /\bbg-white(?!\/)/g, replacement: 'bg-surface' },
  { regex: /\btext-gray-900\b/g, replacement: 'text-content' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-surface-alt' },
  { regex: /\bborder-gray-100\b/g, replacement: 'border-line' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-line-strong' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-content-muted' },
  { regex: /\btext-gray-400\b/g, replacement: 'text-content-subtle' },
  { regex: /\bbg-ghost\b/g, replacement: 'bg-app' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
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
      processFile(fullPath);
    }
  }
}

processFile('App.tsx');
walkDir('components');
