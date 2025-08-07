import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { log } from "../../../../log/app-logger";
import { createNotionPage } from "../../../../notion/page";
import {
	convertQueryDatabaseResponse,
	getTitleFromPageObjectResponse,
	isNotPartialPageObjectResponse,
} from "../../../../notion/queryDatabaseResponse";
import {
	type NotionPage,
	NotionPagesRepository,
} from "../../../../repositories/NotionPagesRepository";
import type { SetupConfig } from "../../../../server/setup";

export const addPage = async (
	config: SetupConfig,
	name: string,
	quantity: number,
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
		log("❌ Notion page creation failed. Missing ID:", notionPage);
		throw new Error("Notion page creation failed");
	}

	if (!notionPage.uniqueId) {
		log("❌ Notion page creation failed. Missing unique ID:", notionPage);
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
			log("Skipping page due to missing required fields:", page.id);
			continue;
		}

		const pageId = page.id;
		log("Processing page:", pageId);

		const title = getTitleFromPageObjectResponse(page);
		if (!title) {
			log("Skipping page due to missing title:", pageId);
			continue;
		}

		const { quantity, link, imageUrl } = convertQueryDatabaseResponse(
			title,
			page,
		);

		log("last_edited_time: page.last_edited_time", page.last_edited_time);
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
