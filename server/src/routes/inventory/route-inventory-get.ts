import { log } from "../../log/app-logger";
import type { SetupConfig } from "../../server/setup";

export const routeInventoryGet = async (req: Request, config: SetupConfig) => {
	try {
		log("📥 Inventory GET request received");

		// Extract query parameters
		const url = new URL(req.url);
		const queryParams = Object.fromEntries(url.searchParams.entries());
		log("Query parameters:", queryParams);

		// const notionService = new NotionPagesRepository();
		// const inventoryItems = await notionService.getPagesByDatabaseId();

		const inventoryItems = [];

		return new Response(JSON.stringify(inventoryItems), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in routeInventoryGet:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
};
