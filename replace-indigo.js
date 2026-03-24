import fs from 'fs';

const files = ['src/screens/HomeScreen.tsx', 'src/screens/SendScreen.tsx', 'App.tsx', 'constants.tsx'];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/indigo-500/g, 'emerald-500');
  content = content.replace(/indigo-600/g, 'emerald-600');
  content = content.replace(/indigo-50/g, 'emerald-50');
  content = content.replace(/indigo-100/g, 'emerald-100');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Replaced indigo');
