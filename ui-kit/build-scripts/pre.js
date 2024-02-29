import { copyFile, rm, mkdir, cp, rename } from 'fs/promises';

const dirsForCopy = [
  'assets',
  'classes',
  'components',
  'composables',
  'interfaces',
  'services',
];
await rename('./public', './_public');
await copyFile('./tsconfig.json', './tsconfig.development.json');
await rm('./tsconfig.json');
await copyFile('./tsconfig.production.json', './tsconfig.json');
dirsForCopy.forEach(async (dir) => {
  await rm(`./lib/${dir}`, { recursive: true, force: true });
  await mkdir(`./lib/${dir}`, { recursive: true });
  await cp(`./src/${dir}`, `./lib/${dir}`, { recursive: true });
});
