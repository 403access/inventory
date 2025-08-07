import type { Client } from "@notionhq/client";
import { log } from "../../../../log/app-logger";
import { NotionPagesRepository } from "../../../../repositories/NotionPagesRepository";
import * as NotionPageService from "../NotionPageService/NotionPageService";

export const syncPages = async (notionClient: Client, databaseId: string) => {
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

	return storedPages.map(({ id }) => ({ id }));
};
