import type { SetupConfig } from "../../server/setup";
import { ImageService } from "../../services/ImageService";
import { LabelService } from "../../services/LabelService";
import { LinkService } from "../../services/LinkService";
import { NotionService } from "../../services/NotionService";
import { UploadService } from "../../services/UploadService";
import { getRouteInventoryAddParams } from "./route-inventory-add-params";

export const routeInventoryAdd = async (req: Request, config: SetupConfig) => {
	try {
		console.log("📤 Upload received");

		// Extract form data
		const formData = await req.formData();
		const routeUploadParams = getRouteInventoryAddParams(req.headers, formData);

		console.log("Route upload params:", routeUploadParams);

		const uploadService = new UploadService(config);
		const {
			originalPath,
			convertedPath,
			originalFilename,
			convertedFilename,
			safeName,
		} = await uploadService.uploadFile(routeUploadParams);

		// Convert image if necessary, e.g. iOS photos (HEIC to JPG)
		const imageService = new ImageService();
		await imageService.convertImage(originalPath, convertedPath);

		//
		const { host, file, name, quantity } = routeUploadParams;

		const linkService = new LinkService(config);
		const { originalURL, convertedURL, shortLinkPlaceholder } =
			linkService.buildLinks(host, originalFilename, convertedFilename);

		// Create entry in notion database
		// Notes: The short link is created after the page is added to Notion
		// so we use a placeholder here and replace it later
		const notionService = new NotionService(config);
		const notionPage = await notionService.addPage(
			safeName,
			quantity,
			shortLinkPlaceholder,
			convertedPath,
		);

		// Create and store short link
		const notionUniqueIdUrl = `https://www.notion.so/${notionPage.uniqueId}`;
		const lowercaseUniqueIdPrefix = notionPage.uniqueIdPrefix.toLowerCase();
		const shortLink = await linkService.buildShortLink(
			notionPage.uniqueIdNumber,
		);
		const csvRow = await linkService.storeShortLinkInCSV(
			notionPage.url,
			safeName,
			quantity,
			originalFilename,
			convertedURL,
			shortLink,
		);
		linkService.createLink(
			notionUniqueIdUrl,
			`${lowercaseUniqueIdPrefix}/${notionPage.uniqueIdNumber}`,
		);

		// Update Notion page with short link
		await notionService.updatePage(notionPage.id, shortLink);

		// Create QR code & label
		const labelService = new LabelService();
		const { labelPath, labelFileName } = await labelService.generateLabel(
			config.LABEL_DIR,
			safeName,
			shortLink,
			notionPage.id,
		);
		await labelService.printLabel(labelPath);

		const labelUrl = `/public/labels/${labelFileName}`;

		return Response.json({
			id: notionPage.id,
			name: safeName,
			quantity,
			original: originalURL,
			converted: convertedURL,
			link: shortLink,
			target_link: notionPage.url,
			label_path: labelPath,
			label_url: labelUrl,
			csv_row: csvRow,
		});
	} catch (error) {
		return new Response(`❌ Upload failed: ${error.message}`, { status: 500 });
		// return new Response("No file uploaded or wrong field name", { status: 400 });
	}
};
