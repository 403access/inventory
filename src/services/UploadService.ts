import { storeFile } from "../media/files";
import type { UploadParams } from "../routes/inventory/route-inventory-add-params";
import type { SetupConfig } from "../server/setup";

export class UploadService {
	constructor(private config: SetupConfig) {}

	async uploadFile({ file, name }: UploadParams) {
		const {
			originalPath,
			convertedPath,
			originalFilename,
			convertedFilename,
			safeName,
		} = await storeFile(file, name, this.config.IMAGE_DIR);

		return {
			originalPath,
			convertedPath,
			originalFilename,
			convertedFilename,
			safeName,
		};
	}
}
