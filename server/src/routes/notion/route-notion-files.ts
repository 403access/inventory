import type { BunRequest } from "bun";
import { NotionFilesRepository } from "../../repositories/NotionFilesRepository";

export const routeNotionFile = async (req: BunRequest<":id">) => {
	if (!req.params.id) {
		console.error("User ID is required");
		return new Response("User ID is required", { status: 400 });
	}

	const notionFilesRepository = new NotionFilesRepository();
	const file = notionFilesRepository.getFileById(req.params.id);

	if (!file) {
		return new Response("File not found", { status: 404 });
	}

	return new Response(JSON.stringify(file), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const routeNotionFiles = async () => {
	const notionFilesRepository = new NotionFilesRepository();
	const files = notionFilesRepository.getFiles();

	if (!files) {
		return new Response("No files found", { status: 404 });
	}

	return new Response(JSON.stringify(files), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
