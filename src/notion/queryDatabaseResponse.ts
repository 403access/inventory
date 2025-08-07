import type {
	PageObjectResponse,
	QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { log } from "../log/app-logger";

export type NameProperty = PageObjectResponse["properties"]["Name"];

export const getTitleFromPageObjectResponse = (
	pageResponse: QueryDatabaseResponse["results"][number],
): string | undefined => {
	if (
		pageResponse !== null &&
		typeof pageResponse === "object" &&
		"id" in pageResponse &&
		"properties" in pageResponse &&
		"Name" in pageResponse.properties &&
		pageResponse.properties.Name.type === "title" &&
		Array.isArray(pageResponse.properties.Name.title) &&
		pageResponse.properties.Name.title.length > 0
	) {
		return pageResponse.properties.Name.title[0].plain_text;
	}
	return undefined;
};

export const pageObjectResponseHasTitle = (
	pageResponse: QueryDatabaseResponse["results"][number],
): boolean => {
	return (
		pageResponse !== null &&
		typeof pageResponse === "object" &&
		"id" in pageResponse &&
		"properties" in pageResponse &&
		"Name" in pageResponse.properties &&
		pageResponse.properties.Name.type === "title" &&
		Array.isArray(pageResponse.properties.Name.title) &&
		pageResponse.properties.Name.title.length > 0
	);
};

export const namePropertyHasTitle = (nameProp: NameProperty): boolean => {
	return (
		nameProp &&
		nameProp.type === "title" &&
		Array.isArray(nameProp.title) &&
		nameProp.title.length > 0
	);
};

export const getTitle = (nameProp: any): string | undefined => {
	return nameProp?.title?.[0]?.plain_text;
};

export const convertQueryDatabaseResponse = (
	title: string,
	page: PageObjectResponse,
) => {
	log("title:", title);

	// let title = "Unnamed";
	// const nameProp = page.properties?.Name;
	// if (
	// 	nameProp &&
	// 	nameProp.type === "title" &&
	// 	Array.isArray(nameProp.title) &&
	// 	nameProp.title.length > 0
	// ) {
	// 	title = nameProp.title[0]?.plain_text ?? "Unnamed";
	// }

	let quantity = 0;
	const quantityProp = page.properties?.Quantity;
	if (
		quantityProp &&
		quantityProp.type === "number" &&
		typeof quantityProp.number === "number"
	) {
		quantity = quantityProp.number;
	}

	let link = "";
	const linkProp = page.properties?.Link;
	if (linkProp && linkProp.type === "url" && typeof linkProp.url === "string") {
		link = linkProp.url;
	}

	const imageUrl =
		page.cover && "external" in page.cover ? page.cover.external.url : "";

	return {
		quantity,
		link,
		imageUrl,
	};
};

export const isNotPartialPageObjectResponse = (
	pageResponse: QueryDatabaseResponse["results"][number],
) => {
	return (
		pageResponse !== null &&
		typeof pageResponse === "object" &&
		"id" in pageResponse &&
		"created_time" in pageResponse &&
		"properties" in pageResponse &&
		"object" in pageResponse &&
		pageResponse.object === "page"
		// "url" in pageResponse &&
		// "cover" in pageResponse &&
		// "last_edited_time" in pageResponse
	);
};
