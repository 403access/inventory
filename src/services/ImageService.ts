import { convertImage } from "../media/convert";

export class ImageService {
	async convertImage(originalPath: string, convertedPath: string) {
		return await convertImage(originalPath, convertedPath);
	}
}
