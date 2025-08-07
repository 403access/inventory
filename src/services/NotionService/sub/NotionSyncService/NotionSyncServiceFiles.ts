import type { Client } from "@notionhq/client";
import { log } from "../../../../log/app-logger";
import { NotionFilesRepository } from "../../../../repositories/NotionFilesRepository";
import { getUploadedFiles } from "../NotionUploadService";

export const syncFiles = async (
	notionClient: Client,
	databaseId: string,
	storedPages: Array<{ id: string }>,
) => {
	// get uploaded files for each page
	// and store them in the database if not already stored
	const notionFilesRepository = new NotionFilesRepository();

	for (const page of storedPages) {
		await log("Processing page for uploaded files:", page.id);

		const uploadedFiles = await getUploadedFiles(notionClient, page.id);
		log("Uploaded files for page:", page.id, JSON.stringify(uploadedFiles));

		if (!uploadedFiles) {
			await log("No uploaded files found for page:", page.id);
			continue;
		}

		const filesToInsert = uploadedFiles.map((file) => ({
			...file,
			database_id: databaseId,
			page_id: page.id,
		}));

		await log("Inserting file data:", JSON.stringify(filesToInsert));
		notionFilesRepository.insertFiles(filesToInsert);
		await log("Inserted file for page:", page.id);
	}
};
