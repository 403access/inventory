import type { Client } from "@notionhq/client";
import { log } from "../../../../log/app-logger";
import { isNotPartialUpdatePageResponse } from "../../../../notion/page-object";

export const updatePage = async (
	notionClient: Client,
	pageId: string,
	shortLink: string,
): Promise<void> => {
	log("Updating Notion page:", pageId, "with short link:", shortLink);
	const response = await notionClient.pages.update({
		page_id: pageId,
		properties: {
			Link: {
				url: shortLink,
			},
		},
	});
	log("Notion page updated:", response);

	if (!isNotPartialUpdatePageResponse(response)) {
		throw new Error("Notion API did not return a update page response.");
	}

	log("Updated Notion page:", response.id);
};
