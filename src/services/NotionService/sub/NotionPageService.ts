import type { Client } from "@notionhq/client";
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { createNotionPage } from "../../../notion/page";
import {
	isNotPartialPageResponse,
	isNotPartialUpdatePageResponse,
} from "../../../notion/page-object";
import {
	convertQueryDatabaseResponse,
	getTitleFromPageObjectResponse,
	isNotPartialPageObjectResponse,
} from "../../../notion/queryDatabaseResponse";
import {
	type NotionPage,
	NotionPagesRepository,
} from "../../../repositories/NotionPagesRepository";
import type { SetupConfig } from "../../../server/setup";

export const addPage = async (
	config: SetupConfig,
	name: string,
	quantity: string,
	shortLinkPlaceholder: string,
	convertedPath: string,
) => {
	const notionPage = await createNotionPage(
		config.NOTION_API_TOKEN,
		config.NOTION_DATABASE_ID,
		name,
		quantity,
		shortLinkPlaceholder,
		convertedPath,
	);

	if (!notionPage?.id) {
		console.error("❌ Notion page creation failed. Missing ID:", notionPage);
		throw new Error("Notion page creation failed");
	}

	if (!notionPage.uniqueId) {
		console.error(
			"❌ Notion page creation failed. Missing unique ID:",
			notionPage,
		);
		throw new Error("Notion page creation failed");
	}

	return notionPage;
};

export const storePages = async (
	databaseId: string,
	queryDatabaseResponse: QueryDatabaseResponse,
) => {
	const pages = queryDatabaseResponse;
	const notionPagesRepository = new NotionPagesRepository();

	const results: NotionPage[] = [];
	for (const page of pages.results) {
		if (!isNotPartialPageObjectResponse(page)) {
			console.warn("Skipping page due to missing required fields:", page.id);
			continue;
		}

		const pageId = page.id;
		console.log("Processing page:", pageId);

		const title = getTitleFromPageObjectResponse(page);
		if (!title) {
			console.warn("Skipping page due to missing title:", pageId);
			continue;
		}

		const { quantity, link, imageUrl } = convertQueryDatabaseResponse(
			title,
			page,
		);

		console.log(
			"last_edited_time: page.last_edited_time",
			page.last_edited_time,
		);
		const pageEntity = {
			id: pageId,
			database_id: databaseId,
			title,
			quantity,
			link,
			image_url: imageUrl,
			created_time: page.created_time,
			last_edited_time: page.last_edited_time,
		};
		notionPagesRepository.insertPage(pageEntity);

		results.push(pageEntity);
	}

	return results;
};

export const updatePage = async (
	notionClient: Client,
	pageId: string,
	shortLink: string,
): Promise<void> => {
	const response = await notionClient.pages.update({
		page_id: pageId,
		properties: {
			Link: {
				url: shortLink,
			},
		},
	});
	console.log("Notion page updated:", response);

	if (!isNotPartialUpdatePageResponse(response)) {
		throw new Error("Notion API did not return a update page response.");
	}

	console.log("Updated Notion page:", response.id);
};

export const getPages = async (
	notionClient: Client,
	databaseId: string,
	lastUpdatedTime?: string,
) => {
	const response = await notionClient.databases.query({
		database_id: databaseId,
		...(lastUpdatedTime
			? {
					filter: {
						property: "Created",
						created_time: {
							after: lastUpdatedTime,
						},
					},
				}
			: {}),
	});

	if (!isNotPartialPageResponse(response)) {
		throw new Error("Notion API did not return a full page object.");
	}

	if (!response.results || response.results.length === 0) {
		console.warn("No pages found in the Notion database.");
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
