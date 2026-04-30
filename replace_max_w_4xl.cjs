const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/max-w-4xl/g, 'max-w-full');
fs.writeFileSync('App.tsx', content);
