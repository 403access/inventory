import { NotionDatabaseRepository } from "../../repositories/NotionDatabaseRepository";
import type { SetupConfig } from "../../server/setup";

export const routeNotionDatabases = async (config: SetupConfig) => {
	const notionDatabaseRepository = new NotionDatabaseRepository(config);
	const databases = notionDatabaseRepository.getAllDatabases();

	return new Response(JSON.stringify(databases));
};
