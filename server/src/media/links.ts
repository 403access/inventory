export const buildLinks = (
	host: string,
	originalFilename: string,
	convertedFilename: string,
) => {
	const originalURL = `http://${host}/images/${originalFilename}`;
	const convertedURL = `http://${host}/images/${convertedFilename}`;

	const shortLinkPlaceholder = "TEMP_LINK_REPLACED_LATER";

	return {
		originalURL,
		convertedURL,
		shortLinkPlaceholder,
	};
};

export const buildShortLink = (notionId: string) => {
	return `https://link.olimo.me/inventory/${notionId}`;
};
