import fs from 'fs';
import https from 'https';
import path from 'path';

const avatars = [
  { name: 'male-1.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Felix&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'male-2.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Jack&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'male-3.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Oliver&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'male-4.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Leo&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'female-1.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Mia&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'female-2.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Chloe&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'female-3.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Zoe&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'female-4.svg', url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Lily&backgroundColor=ffffff&shapeColor=2da437' },
  { name: 'giftcard.svg', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=giftcard&backgroundColor=ffffff' },
  { name: 'bitcoin.svg', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=bitcoin&backgroundColor=ffffff' }
];

const dir = './public/assets/avatars';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

avatars.forEach(avatar => {
  const file = fs.createWriteStream(path.join(dir, avatar.name));
  https.get(avatar.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${avatar.name}`);
    });
  });
});
