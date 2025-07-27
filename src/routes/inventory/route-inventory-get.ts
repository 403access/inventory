import { NotionPagesRepository } from "../../repositories/NotionPagesRepository";
import type { SetupConfig } from "../../server/setup";
import { NotionService } from "../../services/NotionService";

export const routeInventoryGet = async (req: Request, config: SetupConfig) => {
	try {
		console.log("📥 Inventory GET request received");

		// Extract query parameters
		const url = new URL(req.url);
		const queryParams = Object.fromEntries(url.searchParams.entries());
        console.log("Query parameters:", queryParams);

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
