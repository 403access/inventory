import type {
	QueryDatabaseResponse,
	UpdatePageResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const isNotPartialPageResponse = async (
	pageResponse: QueryDatabaseResponse,
) => {
	return (
		pageResponse !== null &&
		typeof pageResponse === "object" &&
		"results" in pageResponse &&
		Array.isArray(pageResponse.results) &&
		pageResponse.results.length > 0 &&
		pageResponse.results[0].object === "page"

		// pageResponse.results.every(
		// 	(page) =>
		// 		typeof page === "object" &&
		// 		"id" in page &&
		// 		"created_time" in page &&
		// 		"properties" in page &&
		// 		"object" in page &&
		// 		page.object === "page",
		// )
	);
};

export const isNotPartialUpdatePageResponse = async (
	pageResponse: UpdatePageResponse,
) => {
	return (
		pageResponse !== null &&
		typeof pageResponse === "object" &&
		"id" in pageResponse &&
		"created_time" in pageResponse &&
		"properties" in pageResponse &&
		"object" in pageResponse &&
		pageResponse.object === "page"
	);
};
