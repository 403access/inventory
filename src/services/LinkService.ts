import { postLinks, setApiKey } from "@short.io/client-node";
import { log } from "../log/app-logger";
import { appendToCSV } from "../media/csv";
import { buildLinks, buildShortLink } from "../media/links";
import type { SetupConfig } from "../server/setup";

export class LinkService {
	constructor(private config: SetupConfig) {}

	buildLinks = buildLinks;

	setup() {
		setApiKey(this.config.SHORTIO_API_KEY);
	}

	async createLink(originalURL: string, path: string) {
		try {
			const result = await postLinks({
				body: {
					originalURL,
					domain: "link.olimo.me",
					path,
				},
			});

			log("Short URL:", result?.data?.shortURL);
			log("Link ID:", result?.data?.idString);
		} catch (error) {
			log("Error creating link:", error);
		}
	}

	async buildShortLink(notionPageId: string): Promise<string> {
		return buildShortLink(notionPageId);
	}

	async storeShortLinkInCSV(
		notionPageUrl: string,
		safeName: string,
		quantity: string,
		originalFilename: string,
		convertedURL: string,
		shortLink: string,
	): Promise<string> {
		return await appendToCSV(
			this.config.CSV_FILE,
			notionPageUrl,
			safeName,
			quantity,
			originalFilename,
			convertedURL,
			shortLink,
		);
	}
}
