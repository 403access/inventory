import type { Client } from "@notionhq/client";
import { log } from "../../../../log/app-logger";
import { NotionDatabaseRepository } from "../../../../repositories/NotionDatabaseRepository";
import type { SetupConfig } from "../../../../server/setup";
import { getDatabase } from "../../NotionServiceBase";
import * as NotionDatabaseService from "../NotionDatabaseService";

export const syncDatabase = async (
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
};
