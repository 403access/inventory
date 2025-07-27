import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";

export const serveStatic = async (req: Request) => {
	const url = new URL(req.url);
	let filePath = path.join("client/dist", url.pathname);

	try {
		const fileStat = await stat(filePath);
		if (fileStat.isDirectory()) {
			filePath = path.join(filePath, "index.html");
		}
		const file = await readFile(filePath);
		const type = mime.lookup(filePath) || "text/plain";
		return new Response(file, {
			headers: { "Content-Type": type },
		});
	} catch {
		return new Response("Not Found", { status: 404 });
	}
};
