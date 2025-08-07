import * as fs from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";
import { log } from "../log/app-logger";

export const uploadFileToNotion = async (notionApiKey, imagePath) => {
	const res = await fetch("https://api.notion.com/v1/file_uploads", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${notionApiKey}`,
			"Notion-Version": "2022-06-28",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({}),
	});

	const fileUpload = await res.json();
	log("🔔 Notion file upload response:", fileUpload);

	const buffer = await fs.readFile(imagePath);
	const blob = new Blob([buffer], {
		type: mime.lookup(imagePath) || "application/octet-stream",
	});
	const form = new FormData();
	form.append("file", blob, path.basename(imagePath));

	const uploadRes = await fetch(`${fileUpload.upload_url}`, {
		method: "POST",
		body: form,
		headers: {
			Authorization: `Bearer ${notionApiKey}`,
			"Notion-Version": "2022-06-28",
		},
	});
	log("🔔 Notion file upload status:", uploadRes.status);
	log("🔔 Notion file upload body:", await uploadRes.json());

	if (!uploadRes.ok) {
		const text = await uploadRes.text();
		throw new Error(
			`❌ File upload to Notion failed. Status: ${uploadRes.status}\n${text}`,
		);
	}

	log(fileUpload.id, "File uploaded successfully to Notion.");
	return fileUpload.id;
};
