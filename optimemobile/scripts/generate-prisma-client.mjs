import fs from 'node:fs';
import { execSync } from 'node:child_process';

if (fs.existsSync('prisma/schema.prisma')) {
  try {
    console.log('[generate-prisma-client] Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (err) {
    console.warn('[generate-prisma-client] prisma generate skipped or failed:', err.message);
  }
} else {
  console.log('[generate-prisma-client] No prisma/schema.prisma found; using in-memory mock client.');
}
