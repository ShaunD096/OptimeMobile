// Guard: Verify no server secrets leaked into NEXT_PUBLIC_* or VITE_* env vars
const FORBIDDEN_SECRET_NAMES = [
  'SECRET', 'KEY', 'PASSWORD', 'TOKEN', 'PRIVATE', 'DATABASE_URL'
];

let hasError = false;
for (const key of Object.keys(process.env)) {
  if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('VITE_')) {
    const upper = key.toUpperCase();
    if (FORBIDDEN_SECRET_NAMES.some(term => upper.includes(term)) && !upper.includes('ANON_KEY')) {
      console.error(`[Security Error] Client-exposed environment variable contains sensitive term: ${key}`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('[check-client-env] Clean client environment check passed.');
}
