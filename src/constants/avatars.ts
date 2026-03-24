export const AVATARS = {
  male: [
    '/assets/avatars/male-1.svg',
    '/assets/avatars/male-2.svg',
    '/assets/avatars/male-3.svg',
    '/assets/avatars/male-4.svg',
  ],
  female: [
    '/assets/avatars/female-1.svg',
    '/assets/avatars/female-2.svg',
    '/assets/avatars/female-3.svg',
    '/assets/avatars/female-4.svg',
  ]
};

export const getAvatarUrl = (username: string = 'user') => {
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isMale = hash % 2 === 0;
  const index = (hash % 4) + 1;
  const gender = isMale ? 'male' : 'female';
  return `/assets/avatars/${gender}-${index}.svg`;
};
