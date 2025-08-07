import type {
	BlockObjectResponse,
	ImageBlockObjectResponse,
	PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type AnyBlockObjectResponse =
	| BlockObjectResponse
	| PartialBlockObjectResponse;

export const isImageBlock = (
	block: AnyBlockObjectResponse,
): block is ImageBlockObjectResponse => {
	return "created_time" in block && block.type === "image";
};

export type FileImageBlockObjectResponse =
	(ImageBlockObjectResponse["image"] & { type: "file" })["file"];

export type getBlockImageFileOrNullReturnType = {
	file_url: string;
	created_time: string;
	last_edited_time: string;
};
export const getBlockImageFileOrNull = (
	block: AnyBlockObjectResponse,
): getBlockImageFileOrNullReturnType | null => {
	if (isImageBlock(block) && block.image.type === "file") {
		return {
			created_time: block.created_time,
			last_edited_time: block.last_edited_time,
			file_url: block.image.file.url,
		};
	}
	return null;
};
