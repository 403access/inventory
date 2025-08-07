import { log } from "./src/log/app-logger";
import { routesConfig } from "./src/routes/config";
import { serveStatic } from "./src/server/serve-static";
import { getServerInfo, setupServer } from "./src/server/setup";

const config = await setupServer();

const server = Bun.serve({
	...(await getServerInfo(config)),

	routes: routesConfig(config),

	// default handler for static files
	fetch(req) {
		return serveStatic(req);
	},
});

await log(`Server is running at ${server.hostname}:${server.port}`);
