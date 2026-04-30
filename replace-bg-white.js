import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/flex-1 flex flex-col bg-white/g, 'flex-1 flex flex-col bg-green-50/30');
fs.writeFileSync('App.tsx', content, 'utf8');
console.log('Replaced bg-white in App.tsx');
