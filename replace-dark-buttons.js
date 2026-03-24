const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/BankDetailsScreen.tsx',
  'src/screens/BillPaymentScreen.tsx',
  'src/screens/CryptoInvoiceScreen.tsx',
  'src/screens/SellScreen.tsx',
  'src/screens/SendScreen.tsx',
  'src/screens/SwapScreen.tsx',
  'src/screens/UnderReviewScreen.tsx',
  'src/screens/WithdrawScreen.tsx',
  'App.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/!bg-dark/g, '!bg-primary');
    content = content.replace(/shadow-dark\//g, 'shadow-primary/');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
