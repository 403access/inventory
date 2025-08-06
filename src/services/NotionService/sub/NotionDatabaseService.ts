import type { DatabaseObjectResponse } from "@notionhq/client";
import { assertNotionDatabaseId } from "../../../notion/database-object";
import { NotionDatabaseRepository } from "../../../repositories/NotionDatabaseRepository";
import type { SetupConfig } from "../../../server/setup";
import { convertDatabaseObjectResponseToDatabase } from "../NotionServiceBase";

export const storeDatabase = async (
	config: SetupConfig,
	databaseResponse: DatabaseObjectResponse,
) => {
	const notionDatabaseRepository = new NotionDatabaseRepository(config);
	assertNotionDatabaseId(databaseResponse);

	const notionDatabase =
		convertDatabaseObjectResponseToDatabase(databaseResponse);
	console.log("Storing Notion database:", notionDatabase);

	notionDatabaseRepository.insertDatabase(notionDatabase);
};

export const updateDatabase = async (
	config: SetupConfig,
	databaseResponse: DatabaseObjectResponse,
): Promise<void> => {
	const notionDatabaseRepository = new NotionDatabaseRepository(config);
	assertNotionDatabaseId(databaseResponse);

	const notionDatabase =
		convertDatabaseObjectResponseToDatabase(databaseResponse);
	console.log("Updating Notion database:", notionDatabase);

	notionDatabaseRepository.updateDatabase(notionDatabase);
};
