import { routesConfig } from "./src/routes/config";
import { serveStatic } from "./src/server/serve-static";
import { setupServer } from "./src/server/setup";

const config = await setupServer();

Bun.serve({
	hostname: config.HOST,
	port: 3000,
	routes: routesConfig(config),
	fetch(req) {
		return serveStatic(req);
	},
});
