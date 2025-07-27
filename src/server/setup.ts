import { setupDatabase } from "../database/setup";
import { LinkService } from "../services/LinkService";
import { NotionService } from "../services/NotionService";
import { getEnv, validateEnv } from "../utils/env";
import { createFolders } from "../utils/folders";

export const setupServer = async () => {
	const env = await getEnv();

	// TODO: Use TypeScript magic to infer these keys to properties
	validateEnv(env, [
		"NOTION_API_TOKEN",
		"NOTION_DATABASE_ID",
		"HOST",
		"SHORTIO_API_KEY",
	]);
	const { NOTION_API_TOKEN, NOTION_DATABASE_ID, HOST, SHORTIO_API_KEY } = env;

	setupDatabase();

	const folders = await createFolders();
	const { IMAGE_DIR, LABEL_DIR, CSV_DIR } = folders.public;

	const CSV_FILE = `${CSV_DIR}/inventory.csv`;

	const config = {
		NOTION_API_TOKEN,
		NOTION_DATABASE_ID,
		IMAGE_DIR,
		LABEL_DIR,
		CSV_FILE,
		HOST,
		SHORTIO_API_KEY,
	};

	const linkService = new LinkService(config);
	linkService.setup();
	linkService.createLink(`https://notion.so/INVENTORY-25`, "inventory/25");

	const notionService = new NotionService(config);
	await notionService.sync();

	return config;
};

export type SetupConfig = Awaited<ReturnType<typeof setupServer>>;
