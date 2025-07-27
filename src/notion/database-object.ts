import type {
	DatabaseObjectResponse,
	GetDatabaseResponse,
} from "@notionhq/client";

export const assertNotionDatabaseId = (
	databaseResponse: DatabaseObjectResponse,
) => {
	if (!databaseResponse.id) {
		throw new Error("Notion database ID is missing.");
	}
};

export const removeDashesFromDatabaseIdAndAssert = (
	databaseResponse: DatabaseObjectResponse,
	notionDatabaseId: string,
) => {
	const replacedId = databaseResponse.id.replace(/-/g, "");
	if (replacedId !== notionDatabaseId) {
		console.error(
			"Notion database ID does not match the configured ID.",
			databaseResponse.id,
			notionDatabaseId,
		);
		throw new Error("Notion database ID does not match the configured ID.");
	}
};

export const isNotPartialDatabaseObjectResponse = (
	databaseResponse: GetDatabaseResponse,
) => {
	return (
		databaseResponse !== null &&
		typeof databaseResponse === "object" &&
		"title" in databaseResponse &&
		"url" in databaseResponse &&
		"created_time" in databaseResponse &&
		"last_edited_time" in databaseResponse
	);
};
