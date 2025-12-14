const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'public', 'Media innhold');
const outputDir = path.join(__dirname, 'public', 'images', 'industries');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Landscape images we want to use (based on user preference)
const landscapeImages = [
  'medium-shot-men-discussing-job.jpg', // Hero image
  'caucasian-technician-engineer-man-uniform-with-tablet-checking-control-boiler-tanks-liquid-pipeline-chemical-factory-production-line.jpg',
  'construction-engineers-with-hard-hats.jpg',
  'factory-workers-working-with-adept-robotic-arm-workshop.jpg',
  'male-car-mechanic-using-tablet-device-car-repair-shop.jpg',
  'man-spraying-powder-paint-from-gun-full-shot.jpg',
  'mature-man-examining-factory.jpg',
  'medium-shot-man-checking-car.jpg',
  'professional-cleaner-wearing-protection-uniform-cleaning-floor-production-plant.jpg',
  'view-male-engineer-work-engineers-day-celebration.jpg',
  'worker-uniform-with-hard-hat-protective-glasses.jpg'
];

async function optimizeImage(filename, isHero = false) {
  const inputPath = path.join(sourceDir, filename);
  const outputName = filename.replace(/\.[^.]+$/, '.webp');
  const outputPath = path.join(outputDir, outputName);

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`\nProcessing: ${filename}`);
    console.log(`Original size: ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

    // Hero image: larger, higher quality
    // Gallery images: smaller, good quality
    const targetWidth = isHero ? 1200 : 800;
    const quality = isHero ? 85 : 80;

    await sharp(inputPath)
      .resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality })
      .toFile(outputPath);

    const outputSize = fs.statSync(outputPath).size / 1024;
    console.log(`✓ Optimized: ${outputName}`);
    console.log(`  New size: ${outputSize.toFixed(0)}KB`);
    console.log(`  Reduction: ${((1 - (outputSize / 1024) / (fs.statSync(inputPath).size / 1024 / 1024)) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
  }
}

async function optimizeAll() {
  console.log('Starting image optimization...');
  console.log('Source:', sourceDir);
  console.log('Output:', outputDir);
  console.log('---');

  // Optimize hero image first
  console.log('\n=== HERO IMAGE ===');
  await optimizeImage('medium-shot-men-discussing-job.jpg', true);

  // Optimize gallery images
  console.log('\n=== GALLERY IMAGES ===');
  for (const filename of landscapeImages) {
    if (filename !== 'medium-shot-men-discussing-job.jpg') {
      await optimizeImage(filename, false);
    }
  }

  console.log('\n✓ All images optimized!');
  console.log(`\nOptimized images saved to: ${outputDir}`);
}

optimizeAll().catch(console.error);
