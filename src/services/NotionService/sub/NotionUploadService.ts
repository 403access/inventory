import type { Client } from "@notionhq/client";
import { log } from "../../../log/app-logger";
import {
	getBlockImageFileOrNull,
	type getBlockImageFileOrNullReturnType,
} from "../../../notion/block-object";

export const getUploadedFile = async (
	notionClient: Client,
	pageId: string,
): Promise<getBlockImageFileOrNullReturnType | null> => {
	const res = await notionClient.blocks.children.list({
		block_id: pageId,
		start_cursor: undefined,
		page_size: 100,
	});

	if (!res.results || res.results.length === 0) {
		console.warn("No blocks found for page:", pageId);
		return null;
	}

	for (const block of res.results) {
		const imageBlock = getBlockImageFileOrNull(block);
		if (imageBlock) {
			log("Found image block:", imageBlock);
			return imageBlock;
		}
	}

	return null;
};

export const getUploadedFiles = async (
	notionClient: Client,
	pageId: string,
) => {
	log("Fetching uploaded files for page:", pageId);

	const blocks = await notionClient.blocks.children.list({
		block_id: pageId,
		start_cursor: undefined,
		page_size: 100,
	});

	if (!blocks.results || blocks.results.length === 0) {
		console.warn("No blocks found for page:", pageId);
		return null;
	}

	const results: (getBlockImageFileOrNullReturnType & { id: string })[] = [];
	for (const block of blocks.results) {
		const imageFileBlock = getBlockImageFileOrNull(block);
		if (imageFileBlock) {
			log("Found image block:", imageFileBlock);
			results.push({
				id: block.id,
				...imageFileBlock,
			});
		}
	}
	return results;
};
