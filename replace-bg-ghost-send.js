import fs from 'fs';

let content = fs.readFileSync('src/screens/SendScreen.tsx', 'utf8');
content = content.replace(/flex-1 flex flex-col bg-ghost/g, 'flex-1 flex flex-col bg-green-50/30');
fs.writeFileSync('src/screens/SendScreen.tsx', content, 'utf8');
console.log('Replaced bg-ghost in SendScreen.tsx');
