import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, parse, relative } from 'node:path';
import sharp from 'sharp';

const PHOTOS_DIR = join(process.cwd(), 'public', 'photos');
const MOBILE_DIR = join(PHOTOS_DIR, 'mobile');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

const DESKTOP_QUALITY = 75;
const MOBILE_QUALITY = 70;
const DESKTOP_MAX_WIDTH = 1440;
const MOBILE_WIDTH = 400;
const WEBP_EFFORT = 6;

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function shouldSkip(inputPath, outputPath) {
  try {
    const [inputStat, outputStat] = await Promise.all([
      stat(inputPath),
      stat(outputPath),
    ]);
    return outputStat.mtime >= inputStat.mtime;
  } catch {
    return false;
  }
}

async function optimizeImage(inputPath) {
  const { name, ext } = parse(inputPath);
  if (!IMAGE_EXTENSIONS.has(ext.toLowerCase())) {
    return;
  }

  const desktopWebpPath = join(PHOTOS_DIR, `${name}.webp`);
  const mobileWebpPath = join(MOBILE_DIR, `${name}.webp`);

  const desktopSkip = await shouldSkip(inputPath, desktopWebpPath);
  const mobileSkip = await shouldSkip(inputPath, mobileWebpPath);

  if (desktopSkip && mobileSkip) {
    console.log(`Skipping ${relative(process.cwd(), inputPath)} (up to date)`);
    return;
  }

  const pipeline = sharp(inputPath);
  const metadata = await pipeline.metadata();

  const tasks = [];

  if (!desktopSkip) {
    tasks.push(
      pipeline
        .clone()
        .resize({ width: DESKTOP_MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: DESKTOP_QUALITY, effort: WEBP_EFFORT })
        .toFile(desktopWebpPath)
        .then(() => {
          console.log(`Created desktop WebP: ${relative(process.cwd(), desktopWebpPath)}`);
        })
    );
  }

  if (!mobileSkip) {
    tasks.push(
      pipeline
        .clone()
        .resize({ width: MOBILE_WIDTH, withoutEnlargement: true })
        .webp({ quality: MOBILE_QUALITY, effort: WEBP_EFFORT })
        .toFile(mobileWebpPath)
        .then(() => {
          console.log(`Created mobile WebP: ${relative(process.cwd(), mobileWebpPath)}`);
        })
    );
  }

  await Promise.all(tasks);

  const originalSize = (await stat(inputPath)).size;
  const desktopSize = (await stat(desktopWebpPath)).size;
  const mobileSize = (await stat(mobileWebpPath)).size;

  console.log(
    `${name}${ext}: ${(originalSize / 1024).toFixed(1)} KB -> ` +
      `desktop ${(desktopSize / 1024).toFixed(1)} KB, ` +
      `mobile ${(mobileSize / 1024).toFixed(1)} KB`
  );
}

async function main() {
  await ensureDir(MOBILE_DIR);

  const entries = await readdir(PHOTOS_DIR, { withFileTypes: true });
  const imageFiles = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(parse(entry.name).ext.toLowerCase()))
    .map((entry) => join(PHOTOS_DIR, entry.name));

  console.log(`Found ${imageFiles.length} images to optimize`);

  await Promise.all(imageFiles.map(optimizeImage));

  console.log('Image optimization complete');
}

main().catch((error) => {
  console.error('Image optimization failed:', error);
  process.exit(1);
});
