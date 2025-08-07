import type { Client } from "@notionhq/client";
import { log } from "../../../../log/app-logger";
import type { SetupConfig } from "../../../../server/setup";
import { syncDatabase } from "./NotionSyncServiceDatabase";
import { syncFiles } from "./NotionSyncServiceFiles";
import { syncPages } from "./NotionSyncServicePages";

export const sync = async (
	config: SetupConfig,
	notionClient: Client,
	databaseId: string,
) => {
	await log("Notion sync started.");

	// Sync Notion database
	await log("Start Syncing Notion database...");
	await syncDatabase(config, notionClient, databaseId);
	await log("Notion database synced successfully.");

	// Sync Notion pages
	await log("Syncing Notion pages...");
	const pages = await syncPages(notionClient, databaseId);
	await log("Notion pages synced successfully.");

	// Sync Notion files
	await log("Syncing Notion files...");
	await syncFiles(notionClient, databaseId, pages);
	await log("Notion files synced successfully.");

	await log("Notion sync completed successfully");
};
