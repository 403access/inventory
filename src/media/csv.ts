import * as fs from "node:fs/promises";

export const appendToCSV = async (
	csvFile: string,
	notionUrl: string,
	safeName: string,
	quantity: string,
	originalFilename: string,
	convertedURL: string,
	shortLink: string,
) => {
	const row =
		`${safeName},${quantity},${originalFilename},${convertedURL},${shortLink},${notionUrl}\n`.trim();
	await fs.appendFile(csvFile, row);
	return row;
};
