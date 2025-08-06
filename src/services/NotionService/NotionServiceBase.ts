import { Client, type DatabaseObjectResponse } from "@notionhq/client";
import { isNotPartialDatabaseObjectResponse } from "../../notion/database-object";
import type { NotionDatabase } from "../../repositories/NotionDatabaseRepository";

export const getNotionClient = (notionApiToken: string) => {
	return new Client({ auth: notionApiToken });
};

export const getDatabase = async (
	notionClient: Client,
	database_id: string,
) => {
	const database = await notionClient.databases.retrieve({
		database_id,
	});

	if (database.object !== "database") {
		throw new Error("Notion API did not return a full database object.");
	}

	if (!isNotPartialDatabaseObjectResponse(database)) {
		throw new Error(
			"Notion database response is missing required fields (title, created_time, last_edited_time)",
		);
	}

	return database;
};

export const convertDatabaseObjectResponseToDatabase = (
	databaseResponse: DatabaseObjectResponse,
): NotionDatabase => {
	if (!isNotPartialDatabaseObjectResponse(databaseResponse)) {
		throw new Error(
			"Notion database response is missing required fields (title, created_time, last_edited_time)",
		);
	}

	const titles = databaseResponse.title;
	if (!titles || titles.length === 0) {
		throw new Error(
			`Notion database title is missing. ${JSON.stringify(databaseResponse)}`,
		);
	}
	if (titles.length > 1) {
		throw new Error(
			`Notion database title is not supported yet. Please use the first title. ${JSON.stringify(databaseResponse)}`,
		);
	}
	const title = titles[0];
	const titleText = title.plain_text;

	return {
		id: databaseResponse.id,
		title: titleText,
		url: databaseResponse.url,
		created_time: databaseResponse.created_time,
		last_edited_time: databaseResponse.last_edited_time,
	};
};
