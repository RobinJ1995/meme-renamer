const fs = require('fs').promises;
const path = require('path');
const { createWorker } = require('tesseract.js');
const MAX_FILENAME_LENGTH = 255;

const srcFolder = process.argv[2];
if (!srcFolder) {
  console.error('No folder path provided.');
  process.exit(1);
}

(async () => {
  try {
    const worker = await createWorker('eng');
    const files = await fs.readdir(srcFolder);
    console.log(`Found ${files.length} files.`);

    for (const file of files) {
      try {
        const filePath = path.join(srcFolder, file);
        console.log(`# Processing file: ${file}`);

        const extension = path.extname(file).toLowerCase();
        if (!['.png', '.jpg', '.jpeg'].includes(extension)) {
          console.log(`- Skipping non-image file: ${file}`);
          continue;
        }

        const { data: { text } } = await worker.recognize(filePath);

        if (!text.trim()) {
          console.log(`- No text recognised in ${file}. Skipping rename.`);
          continue;
        }

        const newBaseFilename = text.trim()
          .replace(/[^a-z0-9]/ig, '-')
          .replace(/-{2,}/g, '-')
          .slice(0, MAX_FILENAME_LENGTH - extension.length);
        const newFileName = `${newBaseFilename}${extension}`;
        const newFilePath = path.join(srcFolder, newFileName);
        console.log(`- Renaming "${file}" to "${newFileName}"`);
        await fs.rename(filePath, newFilePath);
      } catch (ex) {
        console.error(`@ Failed to process file: ${file}\n${ex}`);
      }
    }
  } catch (error) {
    console.error(`@ ${error}`);
  } finally {
    try {
      await worker.terminate();
    } catch (ex) {}
    process.exit(0);
  }
})();
