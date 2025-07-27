import { exec } from "node:child_process";
import * as fs from "node:fs/promises";

export const convertImage = async (
	originalPath: string,
	convertedPath: string,
) => {
	// Convert using sips with max size
	return await new Promise((resolve, reject) => {
		exec(
			`sips -Z 512 "${originalPath}" --out "${convertedPath}"`,
			(error, stdout, stderr) => {
				if (error) reject(stderr);
				else resolve(stdout);
			},
		);
	});
};

export const convertAndStoreFile = async (imageURL: string) => {
	const maxSizeBytes = 5 * 1024 * 1024;
	const localPath = imageURL.startsWith("http")
		? imageURL.replace(/^http:\/\/[^/]+/, ".")
		: imageURL;
	let imageBuffer = await fs.readFile(localPath);

	let currentSize = imageBuffer.byteLength;
	let resizeStep = 480;

	while (currentSize > maxSizeBytes && resizeStep > 64) {
		await new Promise((resolve, reject) => {
			exec(
				`sips -Z ${resizeStep} "${localPath}" --out "${localPath}"`,
				(error, stdout, stderr) => {
					if (error) reject(stderr);
					else resolve(stdout);
				},
			);
		});
		imageBuffer = await fs.readFile(localPath);
		currentSize = imageBuffer.byteLength;
		resizeStep -= 64;
	}

	return localPath;
};
