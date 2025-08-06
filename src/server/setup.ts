import { setupDatabase } from "../database/setup";
import { initializeLogger } from "../log/app-logger";
import { LinkService } from "../services/LinkService";
import { NotionService } from "../services/NotionService";
import { getEnv, validateEnv } from "../utils/env";
import { createFolders } from "../utils/folders";
/**
 * Get server information from the configuration.
 * @param {SetupConfig} config - The configuration object containing server settings.
 * @returns An object containing the hostname and port.
 */
export const getServerInfo = async (config: SetupConfig) => {
	const hostname = config.HOST ?? undefined;

	// If PORT is not set, current bun (https://bun.sh/) default to 3000
	const port = config.PORT ? parseInt(config.PORT, 10) : 3000;

	const serverInfo = { hostname, port };
	await config.logger.log(`Server info config: ${JSON.stringify(serverInfo)}`);

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

	// Initialize file logger
	const logFilePath = `${folders.LOGS_DIR}/server.log`;
	const logger = await initializeLogger(logFilePath);

	await logger.log("Server setup started");
	await logger.log("Folders created", JSON.stringify(folders));

	const publicFolder = folders.public;
	const CSV_FILE = `${folders.public.CSV_DIR}/inventory.csv`;

	const config = {
		...typedEnv,
		...publicFolder,
		CSV_FILE,
		LOGS_DIR: folders.LOGS_DIR,
		logger,
	};

	const linkService = new LinkService(config);
	linkService.setup();

	const notionService = new NotionService(config);
	await notionService.sync();

	await logger.log("Server setup completed successfully");

	return config;
};

export type SetupConfig = Awaited<ReturnType<typeof setupServer>>;
