import * as fs from 'fs';
const files = ['src/screens/SendScreen.tsx', 'src/screens/SwapScreen.tsx', 'src/screens/BillPaymentScreen.tsx'];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Outer wrappers
  content = content.replace(/className=\"flex-1 flex flex-col bg-green-50\/30 animate-fade-in items-center\"/g, 'className=\"flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0\"');
  content = content.replace(/className=\"flex-1 flex flex-col bg-green-50\/30 animate-fade-in items-center relative overflow-hidden\"/g, 'className=\"flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center relative overflow-hidden w-full h-full min-h-0\"');
  content = content.replace(/className=\"flex-1 flex flex-col bg-green-50\/30 items-center animate-fade-in relative overflow-hidden\"/g, 'className=\"flex-1 flex flex-col bg-green-50/30 items-center animate-fade-in relative overflow-hidden w-full h-full min-h-0\"');
  content = content.replace(/className=\"flex-1 flex flex-col bg-green-50\/30 animate-fade-in overflow-hidden items-center\"/g, 'className=\"flex-1 flex flex-col bg-green-50/30 animate-fade-in overflow-hidden items-center w-full h-full min-h-0\"');
  content = content.replace(/className=\"flex-1 flex flex-col bg-green-50\/30 animate-fade-in relative items-center\"/g, 'className=\"flex-1 flex flex-col bg-green-50/30 animate-fade-in relative items-center w-full h-full overflow-hidden min-h-0\"');
  
  // Inner wrappers
  content = content.replace(/className=\"w-full flex flex-col h-full\"/g, 'className=\"w-full flex flex-col flex-1 min-h-0\"');
  content = content.replace(/className=\"w-full flex flex-col h-full relative z-10\"/g, 'className=\"w-full flex flex-col flex-1 min-h-0 relative z-10\"');
  content = content.replace(/className=\"w-full max-w-xl flex flex-col h-full mx-auto\"/g, 'className=\"w-full max-w-xl flex flex-col flex-1 min-h-0 mx-auto\"');
  content = content.replace(/className=\"w-full max-w-xl flex flex-col h-full mx-auto relative z-10\"/g, 'className=\"w-full max-w-xl flex flex-col flex-1 min-h-0 mx-auto relative z-10\"');
  content = content.replace(/className=\"w-full max-w-2xl flex flex-col h-full mx-auto\"/g, 'className=\"w-full max-w-2xl flex flex-col flex-1 min-h-0 mx-auto\"');
  
  // Scrollable areas
  content = content.replace(/overflow-y-auto no-scrollbar pb-24/g, 'overflow-y-auto no-scrollbar pb-24 min-h-0');
  content = content.replace(/overflow-y-auto no-scrollbar flex-1 pb-24/g, 'overflow-y-auto no-scrollbar flex-1 pb-24 min-h-0');
  content = content.replace(/overflow-y-auto no-scrollbar/g, 'overflow-y-auto no-scrollbar min-h-0');
  // Fix duplicate min-h-0 if any
  content = content.replace(/min-h-0 min-h-0/g, 'min-h-0');
  
  fs.writeFileSync(file, content);
}
console.log('Done');
