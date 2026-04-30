import fs from 'fs';
import path from 'path';

const replacements = [
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-line' },
  { regex: /\bhover:bg-gray-100\b/g, replacement: 'hover:bg-line' },
  { regex: /\bhover:bg-gray-200\b/g, replacement: 'hover:bg-line-strong' },
  { regex: /\bbg-gray-200\b/g, replacement: 'bg-line-strong' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-content-muted' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-content' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-content' },
  { regex: /\btext-gray-300\b/g, replacement: 'text-content-subtle' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-surface-alt' },
  { regex: /\bbg-gray-800\b/g, replacement: 'bg-surface-alt' },
  { regex: /\bbg-gray-900\b/g, replacement: 'bg-surface' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-line-strong' },
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
