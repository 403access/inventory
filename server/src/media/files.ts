import path from "node:path";

export const storeFile = async (
	file: File,
	name: string,
	imageDir: string,
) => {
	const ext = path.extname(file.name || "") || ".heic";
	const safeName = name.replace(/[^a-z0-9-_]/gi, "_");
	const originalFilename = `${safeName}${ext}`;
	const convertedFilename = `${safeName}_converted.jpg`;

	const originalPath = path.join(imageDir, originalFilename);
	const convertedPath = path.join(imageDir, convertedFilename);

	await Bun.write(originalPath, file);

	return {
		originalPath,
		convertedPath,
		originalFilename,
		convertedFilename,
		safeName,
	};
};
