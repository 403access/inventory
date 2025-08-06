import type { DatabaseObjectResponse } from "@notionhq/client";
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import type { getBlockImageFileOrNullReturnType } from "../notion/block-object";
import type { NotionDatabase } from "../repositories/NotionDatabaseRepository";
import type { SetupConfig } from "../server/setup";
import type { ExcludeFirstParam } from "../types/helpers";
import * as NotionServiceBase from "./NotionService/NotionServiceBase";
import * as NotionDatabaseService from "./NotionService/sub/NotionDatabaseService";
import * as NotionPageService from "./NotionService/sub/NotionPageService";
import { sync } from "./NotionService/sub/NotionSyncService";
import * as NotionUploadService from "./NotionService/sub/NotionUploadService";

export class NotionService {
	constructor(private config: SetupConfig) {}

	public async getDatabase() {
		const notionClient = NotionServiceBase.getNotionClient(
			this.config.NOTION_API_TOKEN,
		);
		return NotionServiceBase.getDatabase(
			notionClient,
			this.config.NOTION_DATABASE_ID,
		);
	}

	public convertDatabaseObjectResponseToDatabase(
		databaseResponse: DatabaseObjectResponse,
	): NotionDatabase {
		return NotionServiceBase.convertDatabaseObjectResponseToDatabase(
			databaseResponse,
		);
	}

	public async storeDatabase(databaseResponse: DatabaseObjectResponse) {
		return NotionDatabaseService.storeDatabase(this.config, databaseResponse);
	}

	public async updateDatabase(
		databaseResponse: DatabaseObjectResponse,
	): Promise<void> {
		return NotionDatabaseService.updateDatabase(this.config, databaseResponse);
	}

	public async getPages(lastUpdatedTime?: string) {
		const notionClient = NotionServiceBase.getNotionClient(
			this.config.NOTION_API_TOKEN,
		);
		return NotionPageService.getPages(
			notionClient,
			this.config.NOTION_DATABASE_ID,
			lastUpdatedTime,
		);
	}

	public async storePages(queryDatabaseResponse: QueryDatabaseResponse) {
		return NotionPageService.storePages(
			this.config.NOTION_DATABASE_ID,
			queryDatabaseResponse,
		);
	}

	public async getUploadedFile(
		pageId: string,
	): Promise<getBlockImageFileOrNullReturnType | null> {
		const notionClient = NotionServiceBase.getNotionClient(
			this.config.NOTION_API_TOKEN,
		);
		return NotionUploadService.getUploadedFile(notionClient, pageId);
	}

	public async getUploadedFiles(pageId: string) {
		const notionClient = NotionServiceBase.getNotionClient(
			this.config.NOTION_API_TOKEN,
		);
		return NotionUploadService.getUploadedFiles(notionClient, pageId);
	}

	public async sync() {
		const notionClient = NotionServiceBase.getNotionClient(
			this.config.NOTION_API_TOKEN,
		);
		return sync(this.config, notionClient, this.config.NOTION_DATABASE_ID);
	}

	async addPage(
		...args: ExcludeFirstParam<typeof NotionPageService.addPage, SetupConfig>
	) {
		return NotionPageService.addPage(this.config, ...args);
	}

	async updatePage(pageId: string, shortLink: string): Promise<void> {
		const notionClient = NotionServiceBase.getNotionClient(
			this.config.NOTION_API_TOKEN,
		);
		return NotionPageService.updatePage(notionClient, pageId, shortLink);
	}
}
