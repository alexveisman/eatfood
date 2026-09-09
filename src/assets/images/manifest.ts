// СГЕНЕРИРОВАНО АВТОМАТИЧЕСКИ — не редактируйте вручную.
// Источник: scripts/optimize-images.mjs (npm run images)

import type { ResponsiveImage } from '../../types';

import saladHerringCoatW400 from './generated/salad-herring-coat-400.webp';
import saladHerringCoatW800 from './generated/salad-herring-coat-800.webp';
import saladHerringCoatW1200 from './generated/salad-herring-coat-1200.webp';
import saladHerringCoatFallback from './generated/salad-herring-coat-800.jpg';
import saladOlivierW400 from './generated/salad-olivier-400.webp';
import saladOlivierFallback from './generated/salad-olivier-800.jpg';
import saladVinegretW400 from './generated/salad-vinegret-400.webp';
import saladVinegretFallback from './generated/salad-vinegret-800.jpg';

export const IMAGES = {
  saladHerringCoat: {
    src: saladHerringCoatFallback,
    srcSet: [`${saladHerringCoatW400} 400w`, `${saladHerringCoatW800} 800w`, `${saladHerringCoatW1200} 1200w`].join(', '),
    blurDataUrl: 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQAgCdASoQAAwAA4BaJZACdAC4NZGx+TyAAP7X+U+2aMatvd45rsbJ7D2E1i8qHtMUNGQT+EW7ZLW4T2z0P2gEtdh3dHm7M7xpO8e4TiwqVSHDthViaw6/PGJGDBUg5CO06qgNy2uAAA==',
    aspectRatio: 1.3333,
  },
  saladOlivier: {
    src: saladOlivierFallback,
    srcSet: [`${saladOlivierW400} 400w`].join(', '),
    blurDataUrl: 'data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAAAwBACdASoQABgAPu1iqU2ppaOiMAgBMB2JbACdMoBOAbVIh0GFcwP2vMAA28A5r/wqxeUg9wrs7x+iiVCGCXXYm2NsVlIFz6f9spLRiHOOeFujqdQOaDVp1Sp13n6D0SD6+Z3oixQburem3wxURFZHizD2/KH1FlxSUdATq/AVOn2ulSeBiNcR6UJ2dAI0c8P7eyETeVS8XL3goL3P0fRN2gA=',
    aspectRatio: 0.6671,
  },
  saladVinegret: {
    src: saladVinegretFallback,
    srcSet: [`${saladVinegretW400} 400w`].join(', '),
    blurDataUrl: 'data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAABwBACdASoQAB0APu1iqk2ppaQiMAgBMB2JbAC7MoAlxBiA0qFNYVVsiidzUAD+shHMKKYwbnuUHhgCw5Q2AH5ERhZynMOmgjenzq1hCF2xF6bGqPPVsNtnTf5oJUls6hTZ2PmcWGC2nrNpbJATLzTDJkrJkOIPolRGyt9n5sFUqL4sXlBa4PA50FT6tqb0yWWV5E3ubpyPbvTSxmtYzX/aAAA=',
    aspectRatio: 0.5611,
  },
} satisfies Record<string, ResponsiveImage>;

export type ImageKey = keyof typeof IMAGES;
