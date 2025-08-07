import { NotionPagesRepository } from "../../repositories/NotionPagesRepository";

export const routeNotionPages = async () => {
	const notionPagesRepository = new NotionPagesRepository();
	const pages = notionPagesRepository.getAllPages();

	return new Response(JSON.stringify(pages));
};
