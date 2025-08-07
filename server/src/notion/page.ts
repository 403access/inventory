import { log } from "../log/app-logger";
import { convertAndStoreFile } from "../media/convert";
import { uploadFileToNotion } from "./upload";

export const createNotionPage = async (
	notionApiKey: string,
	notionDatabaseId: string,
	name: string,
	quantity: string,
	link: string,
	imageURL: string,
) => {
	const localPath = await convertAndStoreFile(imageURL);

	const fileUploadId = await uploadFileToNotion(notionApiKey, localPath);

	const payload = {
		parent: { database_id: notionDatabaseId },
		properties: {
			Name: {
				title: [
					{
						text: { content: name },
					},
				],
			},
			Quantity: {
				number: parseInt(quantity),
			},
			Link: {
				url: link,
			},
		},
		children: [
			{
				object: "block",
				type: "image",
				image: {
					caption: [],
					type: "file_upload",
					file_upload: {
						id: fileUploadId,
					},
				},
			},
		],
	};

	const response = await fetch("https://api.notion.com/v1/pages", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${notionApiKey}`,
			"Notion-Version": "2022-06-28",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await response.json();
	log("🔔 Notion response:", data);

	const uniqueIdPrefix = data.properties.ID.unique_id.prefix;
	const uniqueIdNumber = data.properties.ID.unique_id.number;
	const uniqueId = `${uniqueIdPrefix}-${uniqueIdNumber}`;

	return {
		url: data.url,
		id: data.id,
		uniqueIdNumber,
		uniqueIdPrefix,
		uniqueId,
	};
};
