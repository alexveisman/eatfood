/**
 * Генератор адаптивных изображений.
 *
 * Берёт исходные фото из src/assets/images/source/ и создаёт для каждого
 * набор вариантов в src/assets/images/generated/:
 *
 *   <имя>-400.webp   — мобильные миниатюры и карусель
 *   <имя>-800.webp   — карточки на планшетах / retina-миниатюры
 *   <имя>-1200.webp  — полноэкранный просмотр
 *   <имя>-800.jpg    — запасной вариант для браузеров без WebP
 * Плюс крошечный размытый плейсхолдер, встроенный прямо в manifest.ts.
 *
 * Запуск:  npm run images
 *
 * Скрипт идемпотентный: уже существующие свежие варианты пропускаются,
 * поэтому его безопасно вызывать перед каждой сборкой.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * sharp — devDependency и содержит нативный код. Если он почему-то не установился
 * (например, окружение сборки ставит только production-зависимости), сборка не должна
 * падать: готовые варианты и manifest.ts лежат в репозитории и их достаточно.
 */
let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch (error) {
  console.warn('sharp недоступен — используем уже сгенерированные изображения.');
  console.warn(String(error?.message ?? error));
  process.exit(0);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'src/assets/images/source');
const OUT_DIR = path.join(ROOT, 'src/assets/images/generated');

/** Ширины, которые реально нужны вёрстке. Больше 1200px на этом сайте нигде не показывается. */
const WIDTHS = [400, 800, 1200];
const WEBP_QUALITY = 74;
const JPEG_QUALITY = 78;
/** Размер LQIP-плейсхолдера: 16px хватает для размытой подложки и весит ~300 байт. */
const BLUR_WIDTH = 16;

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function toCamelCase(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (chr) => chr.toLowerCase());
}

/** Стабильный ключ: отбрасываем хвостовые таймстемпы из имён вида `pelmeni_handmade_1787563758749.jpg`. */
function toAssetKey(fileName) {
  const withoutTimestamp = fileName.replace(/\.[^.]+$/, '').replace(/_\d{10,}$/, '');
  return toCamelCase(withoutTimestamp);
}

async function isStale(sourcePath, outputPath) {
  if (!existsSync(outputPath)) return true;
  const [src, out] = await Promise.all([stat(sourcePath), stat(outputPath)]);
  return src.mtimeMs > out.mtimeMs;
}

async function processImage(fileName) {
  const sourcePath = path.join(SOURCE_DIR, fileName);
  const base = fileName.replace(/\.[^.]+$/, '');
  const image = sharp(sourcePath, { failOn: 'none' });
  const meta = await image.metadata();
  const generated = [];

  for (const width of WIDTHS) {
    // Не апскейлим: если оригинал меньше запрошенной ширины, вариант не создаём.
    if (meta.width && meta.width < width && width !== WIDTHS[0]) continue;

    const webpPath = path.join(OUT_DIR, `${base}-${width}.webp`);
    if (await isStale(sourcePath, webpPath)) {
      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toFile(webpPath);
    }
    generated.push({ width, file: path.basename(webpPath) });
  }

  // Один JPEG-фолбэк на случай очень старых браузеров и для og:image.
  const jpegPath = path.join(OUT_DIR, `${base}-800.jpg`);
  if (await isStale(sourcePath, jpegPath)) {
    await sharp(sourcePath)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toFile(jpegPath);
  }

  const blurBuffer = await sharp(sourcePath)
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    key: toAssetKey(fileName),
    base,
    variants: generated,
    fallback: path.basename(jpegPath),
    blur: `data:image/webp;base64,${blurBuffer.toString('base64')}`,
    aspectRatio: meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : 4 / 3,
  };
}

/**
 * Генерирует модуль с импортами вариантов. Импорты (а не строки-пути) нужны,
 * чтобы Vite проставил файлам хеш содержимого и мы могли кешировать их навсегда.
 */
function renderManifest(entries) {
  const imports = [];
  const records = [];

  for (const entry of entries) {
    const identifiers = [];
    for (const variant of entry.variants) {
      const ident = `${entry.key}W${variant.width}`;
      imports.push(`import ${ident} from './generated/${variant.file}';`);
      identifiers.push({ ident, width: variant.width });
    }
    const fallbackIdent = `${entry.key}Fallback`;
    imports.push(`import ${fallbackIdent} from './generated/${entry.fallback}';`);

    const srcSet = identifiers.map(({ ident, width }) => `\`\${${ident}} ${width}w\``).join(', ');
    records.push(
      [
        `  ${entry.key}: {`,
        `    src: ${fallbackIdent},`,
        `    srcSet: [${srcSet}].join(', '),`,
        `    blurDataUrl: '${entry.blur}',`,
        `    aspectRatio: ${entry.aspectRatio},`,
        `  },`,
      ].join('\n')
    );
  }

  return `${[
    '// СГЕНЕРИРОВАНО АВТОМАТИЧЕСКИ — не редактируйте вручную.',
    '// Источник: scripts/optimize-images.mjs (npm run images)',
    '',
    "import type { ResponsiveImage } from '../../types';",
    '',
    imports.join('\n'),
    '',
    'export const IMAGES = {',
    records.join('\n'),
    '} satisfies Record<string, ResponsiveImage>;',
    '',
    'export type ImageKey = keyof typeof IMAGES;',
    '',
  ].join('\n')}`;
}

async function main() {
  // Обычное состояние проекта: встроенных фотографий нет, все снимки владелец
  // загружает через панель. Отсутствие папки с исходниками — не ошибка сборки.
  if (!existsSync(SOURCE_DIR)) {
    console.log('Встроенных фотографий нет — шаг обработки изображений пропущен.');
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SOURCE_DIR))
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log('В src/assets/images/source нет изображений — шаг пропущен.');
    return;
  }

  const entries = [];
  let sourceBytes = 0;
  for (const file of files) {
    sourceBytes += (await stat(path.join(SOURCE_DIR, file))).size;
    entries.push(await processImage(file));
    process.stdout.write(`  ✓ ${file}\n`);
  }

  const manifest = renderManifest(entries);
  const manifestPath = path.join(ROOT, 'src/assets/images/manifest.ts');
  const previous = existsSync(manifestPath) ? await readFile(manifestPath, 'utf8') : '';
  if (createHash('sha1').update(previous).digest('hex') !== createHash('sha1').update(manifest).digest('hex')) {
    await writeFile(manifestPath, manifest, 'utf8');
  }

  const outFiles = await readdir(OUT_DIR);
  let outBytes = 0;
  for (const f of outFiles) outBytes += (await stat(path.join(OUT_DIR, f))).size;

  const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} МБ`;
  console.log(
    `\nГотово: ${files.length} исходных фото (${mb(sourceBytes)}) → ${outFiles.length} вариантов (${mb(outBytes)}).`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
