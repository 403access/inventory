import type { Client } from "@notionhq/client";
import { log } from "../../../log/app-logger";
import { NotionDatabaseRepository } from "../../../repositories/NotionDatabaseRepository";
import { NotionFilesRepository } from "../../../repositories/NotionFilesRepository";
import { NotionPagesRepository } from "../../../repositories/NotionPagesRepository";
import type { SetupConfig } from "../../../server/setup";
import { getDatabase } from "../NotionServiceBase";
import * as NotionDatabaseService from "./NotionDatabaseService";
import * as NotionPageService from "./NotionPageService";
import { getUploadedFiles } from "./NotionUploadService";

export const sync = async (
	config: SetupConfig,
	notionClient: Client,
	databaseId: string,
) => {
	const notionDatabaseRepository = new NotionDatabaseRepository(config);

	// get notion database from sqlite db
	const currentDatabase = notionDatabaseRepository.getDatabase();
	await log(
		"Current Notion database from DB:",
		JSON.stringify(currentDatabase),
	);

	// get notion database from notion API
	const newDatabase = await getDatabase(notionClient, databaseId);
	// log("New Notion database from API:", newDatabase);

	// if not exists or has a different id or last_edited_time, create it
	if (currentDatabase === null || currentDatabase.id !== newDatabase.id) {
		await log("Inserting new Notion database to DB...");
		await NotionDatabaseService.storeDatabase(config, newDatabase);
	} else if (
		currentDatabase.last_edited_time !== newDatabase.last_edited_time
	) {
		await log("Updating existing Notion database in DB...");
		await NotionDatabaseService.updateDatabase(config, newDatabase);
	} else {
		await log("Notion database is up-to-date in DB.");
	}

	// build last edited time from the most recent edited page or null
	const notionPagesRepository = new NotionPagesRepository();
	const lastEditedPage = notionPagesRepository.getMostRecentEditedPage();
	await log("Last edited page:", JSON.stringify(lastEditedPage));

	const lastEditedTime = lastEditedPage?.last_edited_time;
	if (lastEditedTime) {
		await log("Last edited time:", lastEditedTime);
	} else {
		await log("No last edited time found, syncing all pages.");
	}

	// query pages for database
	const currentPages = await NotionPageService.getPages(
		notionClient,
		databaseId,
		lastEditedTime ?? undefined,
	);
	await log("Found", currentPages.results.length, "pages in Notion database.");

	// save pages to db
	const storedPages = await NotionPageService.storePages(
		databaseId,
		currentPages,
	);
	await log(
		"Stored",
		storedPages.length,
		"pages in the Notion database repository.",
	);

	// TODO: instead add a last sync time column
	// since the last edited time doesn't let us
	// imply where the last sync was
	//
	// let lastPage: NotionPage | undefined;
	// if (storedPages.length > 0) {
	// 	lastPage = storedPages[storedPages.length - 1];
	// } else if (lastEditedPage) {
	// 	lastPage = lastEditedPage;
	// }
	// log("Last page:", lastPage);

	// get uploaded files for each page
	// and store them in the database if not already stored
	const notionFilesRepository = new NotionFilesRepository();

	for (const page of storedPages) {
		await log("Processing page for uploaded files:", page.id);

		const uploadedFiles = await getUploadedFiles(notionClient, page.id);
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
