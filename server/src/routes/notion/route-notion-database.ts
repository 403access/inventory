import type { SetupConfig } from "../../server/setup";
import { NotionService } from "../../services/NotionService";

export const routeNotionDatabase = async (config: SetupConfig) => {
	const notionService = new NotionService(config);

	const database = (await notionService.getDatabase()) as any;

	return new Response(JSON.stringify(database));
};
