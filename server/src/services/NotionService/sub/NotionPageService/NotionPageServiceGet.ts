import type { Client } from "@notionhq/client";
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { log } from "../../../../log/app-logger";
import { isNotPartialPageResponse } from "../../../../notion/page-object";

export const getNotionDatabaseQueryArgs = (
	database_id: string,
	lastUpdatedTime?: string,
) => {
	const queryArgs: QueryDatabaseParameters = {
		database_id,
	};

	if (lastUpdatedTime !== undefined) {
		const filterByCreatedTimeAfter: QueryDatabaseParameters["filter"] = {
			property: "Created",
			created_time: {
				after: lastUpdatedTime,
			},
		};

		queryArgs.filter = filterByCreatedTimeAfter;
	}

	return queryArgs;
};

export const getPages = async (
	notionClient: Client,
	databaseId: string,
	lastUpdatedTime?: string,
) => {
	log(
		"Querying Notion database for pages:",
		databaseId,
		"after:",
		lastUpdatedTime,
	);

	const queryArgs = getNotionDatabaseQueryArgs(databaseId, lastUpdatedTime);
	log("Query arguments:", JSON.stringify(queryArgs));

	const response = await notionClient.databases.query(queryArgs);

	if (!isNotPartialPageResponse(response)) {
		throw new Error("Notion API did not return a full page object.");
	}

	if (!response.results || response.results.length === 0) {
		log("No pages found in the Notion database.");
		return response;
	}

	for (const page of response.results) {
		if (page.object !== "page") {
			throw new Error(
				`Notion API returned a non-page object for id ${page.id}.`,
			);
		}
	}

	return response;
};
