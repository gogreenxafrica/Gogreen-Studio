import fs from 'fs';

let content = fs.readFileSync('src/screens/WithdrawScreen.tsx', 'utf8');
content = content.replace(/flex-1 flex flex-col bg-white/g, 'flex-1 flex flex-col bg-green-50/30');
fs.writeFileSync('src/screens/WithdrawScreen.tsx', content, 'utf8');
console.log('Replaced bg-white in WithdrawScreen.tsx');
