import { log } from "./log/app-logger";
import { routesConfig } from "./routes/config";
import { serveStatic } from "./server/serve-static";
import { getServerInfo, setupServer } from "./server/setup";

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
