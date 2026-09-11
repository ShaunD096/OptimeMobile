import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Base SVG Icon (1:1)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#030712" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="60%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#818cf8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.2" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background rectangle with rounded corners -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Outer ambient accent ring -->
  <circle cx="256" cy="256" r="192" fill="none" stroke="url(#ringGrad)" stroke-width="6" stroke-dasharray="16 12" />

  <!-- Inner precision circle -->
  <circle cx="256" cy="256" r="160" fill="none" stroke="#1e293b" stroke-width="3" />

  <!-- Ambient background glow behind Omega -->
  <circle cx="256" cy="256" r="110" fill="#0891b2" fill-opacity="0.18" filter="url(#glow)" />

  <!-- Omega / Precision Financial Symbol -->
  <g transform="matrix(1 0 0 1 0 0)" filter="url(#glow)">
    <!-- Stylized Omega Vector -->
    <path
      d="M 160 360 L 208 360 C 218 360 225 352 227 342 C 212 320 200 292 200 256 C 200 186 226 140 256 140 C 286 140 312 186 312 256 C 312 292 300 320 285 342 C 287 352 294 360 304 360 L 352 360 C 361 360 368 367 368 376 C 368 385 361 392 352 392 L 290 392 C 278 392 268 383 266 371 C 280 348 290 318 290 256 C 290 196 274 162 256 162 C 238 162 222 196 222 256 C 222 318 232 348 246 371 C 244 383 234 392 222 392 L 160 392 C 151 392 144 385 144 376 C 144 367 151 360 160 360 Z"
      fill="url(#glyphGrad)"
    />
    <!-- Central diamond node -->
    <polygon points="256,220 274,250 256,280 238,250" fill="#ffffff" opacity="0.95" />
    <circle cx="256" cy="250" r="4" fill="#06b6d4" />
  </g>

  <!-- Precision compass tic-marks -->
  <line x1="256" y1="76" x2="256" y2="92" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
  <line x1="256" y1="420" x2="256" y2="436" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
  <line x1="76" y1="256" x2="92" y2="256" stroke="#818cf8" stroke-width="4" stroke-linecap="round" />
  <line x1="420" y1="256" x2="436" y2="256" stroke="#818cf8" stroke-width="4" stroke-linecap="round" />
</svg>`;

// 2. Maskable SVG Icon (Safe zone with 15% outer padding for Android squircle cropping)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="glyphGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="60%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#bgGradMask)" />

  <!-- Scaled content inside 80% safe zone (center 409x409) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <circle cx="256" cy="256" r="180" fill="none" stroke="#1e293b" stroke-width="4" />
    <circle cx="256" cy="256" r="110" fill="#0891b2" fill-opacity="0.25" />

    <path
      d="M 160 360 L 208 360 C 218 360 225 352 227 342 C 212 320 200 292 200 256 C 200 186 226 140 256 140 C 286 140 312 186 312 256 C 312 292 300 320 285 342 C 287 352 294 360 304 360 L 352 360 C 361 360 368 367 368 376 C 368 385 361 392 352 392 L 290 392 C 278 392 268 383 266 371 C 280 348 290 318 290 256 C 290 196 274 162 256 162 C 238 162 222 196 222 256 C 222 318 232 348 246 371 C 244 383 234 392 222 392 L 160 392 C 151 392 144 385 144 376 C 144 367 151 360 160 360 Z"
      fill="url(#glyphGradMask)"
    />
    <polygon points="256,220 274,250 256,280 238,250" fill="#ffffff" />
  </g>
</svg>`;

async function buildIcons() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon, 'utf8');
  console.log('✓ Wrote public/icon.svg');

  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✓ Generated public/pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✓ Generated public/pwa-512x512.png');

  // 512x512 Maskable PNG
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Generated public/pwa-maskable-512x512.png');

  // Apple touch icon 180x180 PNG
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated public/apple-touch-icon.png');

  // 32x32 Favicon PNG
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✓ Generated public/favicon-32x32.png');
}

buildIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
