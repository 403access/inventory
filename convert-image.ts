import { createCanvas, loadImage } from "canvas";

export async function convertImageToPrintBuffer(
	imagePath: string,
): Promise<Buffer> {
	const img = await loadImage(imagePath);
	const width = img.width;
	const height = img.height;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	ctx.drawImage(img, 0, 0, width, height);
	const imageData = ctx.getImageData(0, 0, width, height).data;

	const bytesPerLine = Math.ceil(width / 8);
	const raw = Buffer.alloc(bytesPerLine * height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4;
			const [r, g, b] = [
				imageData[idx],
				imageData[idx + 1],
				imageData[idx + 2],
			];
			const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
			const isBlack = grayscale < 128;

			if (isBlack) {
				const byteIndex = y * bytesPerLine + (x >> 3);
				raw[byteIndex] |= 0x80 >> (x % 8);
			}
		}
	}

	// ESC * m nL nH raster data
	const header = Buffer.from([
		0x1d,
		0x76,
		0x30,
		0x00, // Set bit-image mode
		bytesPerLine,
		0x00,
		height & 0xff,
		(height >> 8) & 0xff,
	]);

	return Buffer.concat([header, raw]);
}
