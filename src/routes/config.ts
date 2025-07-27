import type { BunRequest } from "bun";
import type { SetupConfig } from "../server/setup";
import { routeInventoryAdd } from "./inventory/route-inventory-add";
import { routeInventoryGet } from "./inventory/route-inventory-get";
import { corsMiddleware as cors } from "./middlewares/cors";
import { routeNotionDatabase } from "./notion/route-notion-database";
import { routeNotionDatabases } from "./notion/route-notion-databases";
import { routeNotionFile, routeNotionFiles } from "./notion/route-notion-files";
import { routeNotionPages } from "./notion/route-notion-pages";
import { routeImage } from "./route-image";

export const routesConfig = (config: SetupConfig) => ({
	"/notion/database": {
		GET: async () => await routeNotionDatabase(config),
	},
	"/notion/databases": {
		GET: async () => cors(await routeNotionDatabases(config)),
	},
	"/notion/pages": {
		GET: async () => cors(await routeNotionPages()),
	},
	"/notion/files": {
		GET: async () => cors(await routeNotionFiles()),
	},
	"/notion/files/:id": {
		GET: async (req: BunRequest) => cors(await routeNotionFile(req)),
	},
	"/images/*": {
		GET: async (req: BunRequest) => await routeImage(req, config.IMAGE_DIR),
	},
	"/inventory": {
		GET: async (req: BunRequest) => await routeInventoryGet(req, config),
		POST: async (req: BunRequest) => await routeInventoryAdd(req, config),
	},
});