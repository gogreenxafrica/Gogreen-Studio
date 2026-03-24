import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/\bbg-ghost\b/g, 'bg-green-50/30');
fs.writeFileSync('App.tsx', content, 'utf8');
console.log('Replaced bg-ghost in App.tsx');
