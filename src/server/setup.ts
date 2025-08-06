import { setupDatabase } from "../database/setup";
import { LinkService } from "../services/LinkService";
import { NotionService } from "../services/NotionService";
import { getEnv, validateEnv } from "../utils/env";
import { createFolders } from "../utils/folders";
/**
 * Get server information from the configuration.
 * @param {SetupConfig} config - The configuration object containing server settings.
 * @returns An object containing the hostname and port.
 */
export const getServerInfo = (config: SetupConfig) => {
	const hostname = config.HOST ?? undefined;

	// If PORT is not set, current bun (https://bun.sh/) default to 3000
	const port = config.PORT ? parseInt(config.PORT, 10) : 3000;

	const serverInfo = { hostname, port };
	console.log(`Server info config: ${JSON.stringify(serverInfo)}`);

	return serverInfo;
};

export const setupServer = async () => {
	const env = await getEnv();

	const typedEnv = validateEnv(env, [
		"NOTION_API_TOKEN",
		"NOTION_DATABASE_ID",
		"HOST",
		"PORT",
		"SHORTIO_API_KEY",
	] as const);

	setupDatabase();

	const folders = await createFolders();
	console.log("Folders created:", folders);

	const publicFolder = folders.public;
	const CSV_FILE = `${folders.public.CSV_DIR}/inventory.csv`;

	const config = {
		...typedEnv,
		...publicFolder,
		CSV_FILE,
	};

	const linkService = new LinkService(config);
	linkService.setup();
	linkService.createLink(`https://notion.so/INVENTORY-25`, "inventory/25");

	const notionService = new NotionService(config);
	await notionService.sync();

	return config;
};

export type SetupConfig = Awaited<ReturnType<typeof setupServer>>;
