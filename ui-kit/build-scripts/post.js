import { copyFile, rm, rename } from 'fs/promises';

await rename('./_public', './public');
await rm('./tsconfig.json');
await copyFile('./tsconfig.development.json', './tsconfig.json');
await rm('./tsconfig.development.json');
