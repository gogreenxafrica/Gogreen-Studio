import fs from 'fs';
import path from 'path';

const replacements = [
  { regex: /\btext-white\b/g, replacement: 'text-content' },
  { regex: /\btext-white\/40\b/g, replacement: 'text-content-subtle' },
  { regex: /\btext-white\/60\b/g, replacement: 'text-content-muted' },
  { regex: /\btext-white\/70\b/g, replacement: 'text-content-muted' },
  { regex: /\btext-white\/80\b/g, replacement: 'text-content' },
  { regex: /\btext-white\/20\b/g, replacement: 'text-content-subtle' },
  { regex: /\bbg-white\/5\b/g, replacement: 'bg-surface-alt' },
  { regex: /\bbg-white\/10\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-white\/20\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-white\/30\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-white\/50\b/g, replacement: 'bg-surface' },
  { regex: /\bborder-white\/5\b/g, replacement: 'border-line' },
  { regex: /\bborder-white\/10\b/g, replacement: 'border-line' },
  { regex: /\bborder-white\/20\b/g, replacement: 'border-line-strong' },
  { regex: /\bborder-white\/30\b/g, replacement: 'border-line-strong' },
  { regex: /\bborder-white\/40\b/g, replacement: 'border-line-strong' },
  { regex: /\btext-dark\b/g, replacement: 'text-content' },
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
