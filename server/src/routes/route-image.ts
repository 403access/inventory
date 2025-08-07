import * as fs from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";

export const routeImage = async (req: Request, imageDir: string) => {
	const url = new URL(req.url);
	const filePath = path.join(imageDir, url.pathname.replace("/images/", ""));

	try {
		const buffer = await fs.readFile(filePath);
		const contentType = mime.lookup(filePath) || "application/octet-stream";
		return new Response(buffer, {
			headers: { "Content-Type": contentType },
		});
	} catch {
		return new Response("File not found", { status: 404 });
	}
};
