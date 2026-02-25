const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '..', 'client', 'public', 'uploads');

async function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            // Process images
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                console.log(`Compressing: ${fullPath}`);
                
                // Read original
                const inputBuffer = fs.readFileSync(fullPath);
                
                // Determine max width based on folder name heuristically
                let maxWidth = 800;
                if (dirPath.includes('cert-images')) maxWidth = 800;
                else if (dirPath.includes('blog-images')) maxWidth = 1000;
                else if (dirPath.includes('skill-logos')) maxWidth = 300;
                else if (dirPath.includes('logos')) maxWidth = 500;

                try {
                    // Overwrite with compressed webp
                    const outputBuffer = await sharp(inputBuffer)
                        .resize(maxWidth, maxWidth, { fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 70 })
                        .toBuffer();
                        
                    // Overwrite original file (changing it to webp content, but keeping ext for simplicity, or we can just rename it. Let's keep original extension but inside it's optimized)
                    fs.writeFileSync(fullPath, outputBuffer);
                    console.log(`  -> Done (Size reduced)`);
                } catch (e) {
                    console.error(`  -> Failed to compress ${file}:`, e.message);
                }
            }
        }
    }
}

console.log('Starting compression of all existing images in:', uploadsDir);
processDirectory(uploadsDir).then(() => {
    console.log('Compression complete!');
});
