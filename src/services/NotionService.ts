import { Client, type DatabaseObjectResponse } from "@notionhq/client";
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import {
	getBlockImageFileOrNull,
	type getBlockImageFileOrNullReturnType,
} from "../notion/block-object";
import {
	assertNotionDatabaseId,
	isNotPartialDatabaseObjectResponse,
} from "../notion/database-object";
import { createNotionPage } from "../notion/page";
import {
	isNotPartialPageResponse,
	isNotPartialUpdatePageResponse,
} from "../notion/page-object";
import {
	convertQueryDatabaseResponse,
	getTitleFromPageObjectResponse,
	isNotPartialPageObjectResponse,
} from "../notion/queryDatabaseResponse";
import {
	type NotionDatabase,
	NotionDatabaseRepository,
} from "../repositories/NotionDatabaseRepository";
import { NotionFilesRepository } from "../repositories/NotionFilesRepository";
import {
	type NotionPage,
	NotionPagesRepository,
} from "../repositories/NotionPagesRepository";
import type { SetupConfig } from "../server/setup";

export class NotionService {
	constructor(private config: SetupConfig) {}

	public async getDatabase() {
		const notion = new Client({ auth: this.config.NOTION_API_TOKEN });
		const database = await notion.databases.retrieve({
			database_id: this.config.NOTION_DATABASE_ID,
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
	}

	public convertDatabaseObjectResponseToDatabase(
		databaseResponse: DatabaseObjectResponse,
	): NotionDatabase {
		if (!isNotPartialDatabaseObjectResponse(databaseResponse)) {
			throw new Error(
				"Notion database response is missing required fields (title, created_time, last_edited_time)",
			);
		}

		const titles = databaseResponse.title;
		if (!titles || titles.length === 0) {
			throw new Error("Notion database title is missing.");
		}
		if (titles.length > 1) {
			throw new Error(
				"Notion database title is not supported yet. Please use the first title.",
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
	}

	public async storeDatabase(databaseResponse: DatabaseObjectResponse) {
		const notionDatabaseRepository = new NotionDatabaseRepository(this.config);
		assertNotionDatabaseId(databaseResponse);

		const notionDatabase =
			this.convertDatabaseObjectResponseToDatabase(databaseResponse);
		console.log("Storing Notion database:", notionDatabase);

		notionDatabaseRepository.insertDatabase(notionDatabase);
	}

	public async updateDatabase(
		databaseResponse: DatabaseObjectResponse,
	): Promise<void> {
		const notionDatabaseRepository = new NotionDatabaseRepository(this.config);
		assertNotionDatabaseId(databaseResponse);

		const notionDatabase =
			this.convertDatabaseObjectResponseToDatabase(databaseResponse);
		console.log("Updating Notion database:", notionDatabase);

		notionDatabaseRepository.updateDatabase(notionDatabase);
	}

	public async getPages(lastUpdatedTime?: string) {
		const notion = new Client({ auth: this.config.NOTION_API_TOKEN });
		const response = await notion.databases.query({
			database_id: this.config.NOTION_DATABASE_ID,
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
	}

	public async storePages(queryDatabaseResponse: QueryDatabaseResponse) {
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
				database_id: this.config.NOTION_DATABASE_ID,
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
	}

	public async getUploadedFile(
		pageId: string,
	): Promise<getBlockImageFileOrNullReturnType | null> {
		const notion = new Client({ auth: this.config.NOTION_API_TOKEN });
		const res = await notion.blocks.children.list({
			block_id: pageId,
			start_cursor: undefined,
			page_size: 100,
		});

		if (!res.results || res.results.length === 0) {
			console.warn("No blocks found for page:", pageId);
			return null;
		}

		for (const block of res.results) {
			const imageBlock = getBlockImageFileOrNull(block);
			if (imageBlock) {
				console.log("Found image block:", imageBlock);
				return imageBlock;
			}
		}

		return null;
	}

	public async getUploadedFiles(pageId: string) {
		console.log("Fetching uploaded files for page:", pageId);

		const notion = new Client({ auth: this.config.NOTION_API_TOKEN });
		const blocks = await notion.blocks.children.list({
			block_id: pageId,
			start_cursor: undefined,
			page_size: 100,
		});

		if (!blocks.results || blocks.results.length === 0) {
			console.warn("No blocks found for page:", pageId);
			return null;
		}

		const results: (getBlockImageFileOrNullReturnType & { id: string })[] = [];
		for (const block of blocks.results) {
			const imageFileBlock = getBlockImageFileOrNull(block);
			if (imageFileBlock) {
				console.log("Found image block:", imageFileBlock);
				results.push({
					id: block.id,
					...imageFileBlock,
				});
			}
		}
		return results;
	}

	public async sync() {
		const notionDatabaseRepository = new NotionDatabaseRepository(this.config);

		// get notion database from sqlite db
		const currentDatabase = notionDatabaseRepository.getDatabase();
		console.log("Current Notion database from DB:", currentDatabase);

		// get notion database from notion API
		const newDatabase = await this.getDatabase();
		// console.log("New Notion database from API:", newDatabase);

		// if not exists or has a different id or last_edited_time, create it
		if (currentDatabase === null || currentDatabase.id !== newDatabase.id) {
			console.log("Inserting new Notion database to DB...");
			await this.storeDatabase(newDatabase);
		} else if (
			currentDatabase.last_edited_time !== newDatabase.last_edited_time
		) {
			console.log("Updating existing Notion database in DB...");
			await this.updateDatabase(newDatabase);
		} else {
			console.log("Notion database is up-to-date in DB.");
		}

		// build last edited time from the most recent edited page or null
		const notionPagesRepository = new NotionPagesRepository();
		const lastEditedPage = notionPagesRepository.getMostRecentEditedPage();
		console.log("Last edited page:", lastEditedPage);

		const lastEditedTime = lastEditedPage?.last_edited_time;
		if (lastEditedTime) {
			console.log("Last edited time:", lastEditedTime);
		} else {
			console.log("No last edited time found, syncing all pages.");
		}

		// query pages for database
		const currentPages = await this.getPages(lastEditedTime ?? undefined);
		console.log(
			"Found",
			currentPages.results.length,
			"pages in Notion database.",
		);

		// save pages to db
		const storedPages = await this.storePages(currentPages);
		console.log(
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
		// console.log("Last page:", lastPage);

		// get uploaded files for each page
		// and store them in the database if not already stored
		const notionFilesRepository = new NotionFilesRepository();

		for (const page of storedPages) {
			console.log("Processing page for uploaded files:", page.id);

			const uploadedFiles = await this.getUploadedFiles(page.id);
			if (!uploadedFiles) {
				console.warn("No uploaded files found for page:", page.id);
				continue;
			}

			const filesToInsert = uploadedFiles.map((file) => ({
				...file,
				database_id: this.config.NOTION_DATABASE_ID,
				page_id: page.id,
			}));

			console.log("Inserting file data:", filesToInsert);
			notionFilesRepository.insertFiles(filesToInsert);
			console.log("Inserted file for page:", page.id);
		}
	}

	async addPage(
		name: string,
		quantity: string,
		shortLinkPlaceholder: string,
		convertedPath: string,
	) {
		const notionPage = await createNotionPage(
			this.config.NOTION_API_TOKEN,
			this.config.NOTION_DATABASE_ID,
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

		return {
			id: notionPage.id,
			uniqueIdNumber: notionPage.uniqueIdNumber,
			uniqueIdPrefix: notionPage.uniqueIdPrefix,
			uniqueId: notionPage.uniqueId,
			url: notionPage.url,
		};
	}

	async updatePage(pageId: string, shortLink: string): Promise<void> {
		const notion = new Client({ auth: this.config.NOTION_API_TOKEN });

		const response = await notion.pages.update({
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
	}
}
