const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


const fetchImage = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image from ${imageUrl}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const compressedBuffer = await sharp(buffer)
            .resize(500) // Optional: Resize to reduce image dimensions
            .jpeg({ quality: 80 }) // Optional: Change format to JPEG with reduced quality
            .toBuffer(); // Convert back to buffer

        return compressedBuffer; // You can also return base64 if needed

    } catch (err) {

        const fallbackPath = path.join(__dirname, '..', 'assets', 'default.jpg');
        const fallbackImage = fs.readFileSync(fallbackPath);

        const processedFallback = await sharp(fallbackImage)
            .resize(500) // Optional: Resize to reduce image dimensions
            .jpeg({ quality: 80 }) // Optional: Change format to JPEG with reduced quality
            .toBuffer(); // Convert back to buffer

        return processedFallback;
    }
}


module.exports = {
    fetchImage
};