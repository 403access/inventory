import { setupDatabase } from "../database/setup";
import { initializeLogger, log } from "../log/app-logger";
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
	await log(`Server info config: ${JSON.stringify(serverInfo)}`);

	return serverInfo;
};

export const setupServer = async () => {
	// Create necessary folders - output most likely at console
	// TODO: We can also log this to the logger.
	//       - For that we need to create a mock logger that caches log calls
	//         and executes them at least on console with console.log.
	//       - Eventually, log the created folders through
	//         the logger once initialized later.
	const folders = await createFolders();

	// Initialize file logger
	const logFilePath = `${folders.LOGS_DIR}/server.log`;
	await log(`File logger initialized at ${logFilePath}`);

	// Log the created folders - output through configured logger
	await log("Folders created", JSON.stringify(folders));

	const env = await getEnv();

	const typedEnv = validateEnv(env, [
		"NOTION_API_TOKEN",
		"NOTION_DATABASE_ID",
		"HOST",
		"PORT",
		"SHORTIO_API_KEY",
	] as const);

	setupDatabase();

	const publicFolder = folders.public;
	const CSV_FILE = `${folders.public.CSV_DIR}/inventory.csv`;

	const config = {
		...typedEnv,
		...publicFolder,
		CSV_FILE,
		LOGS_DIR: folders.LOGS_DIR,
	};

	const linkService = new LinkService(config);
	linkService.setup();

	const notionService = new NotionService(config);
	await notionService.sync();

	await log("Server setup completed successfully");

	return config;
};

export type SetupConfig = Awaited<ReturnType<typeof setupServer>>;
