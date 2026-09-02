#!/usr/bin/env node
// Regenerates best-work grid thumbnails from source PNGs.
// Grid tiles render at 1024x768 CSS px: 1200px-wide webp covers retina without
// shipping the full 4176x3072 original (previous _thumb.webp files were byte-identical
// copies of the full-res image, ~800KB-1MB each instead of a real downscale).
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "assets", "images", "best-work");
const THUMB_WIDTH = 1200;
const THUMB_QUALITY = 70;

async function main() {
  const all = fs.readdirSync(DIR);
  // Prefer the PNG original as source (higher quality than the already-compressed
  // webp); fall back to the full-res webp for images that only shipped as webp.
  const pngBases = new Set(
    all.filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""))
  );
  const fullWebps = all.filter(
    (f) => f.endsWith(".webp") && !f.endsWith("_thumb.webp")
  );

  let totalBefore = 0;
  let totalAfter = 0;

  for (const webpFile of fullWebps) {
    const base = webpFile.replace(/\.webp$/, "");
    const srcFile = pngBases.has(base) ? `${base}.png` : webpFile;
    const srcPath = path.join(DIR, srcFile);
    const thumbPath = path.join(DIR, `${base}_thumb.webp`);

    const before = fs.existsSync(thumbPath) ? fs.statSync(thumbPath).size : 0;
    totalBefore += before;

    await sharp(srcPath)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumbPath);

    const after = fs.statSync(thumbPath).size;
    totalAfter += after;
    console.log(
      `${base} [${srcFile === webpFile ? "webp" : "png"}]: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
    );
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
