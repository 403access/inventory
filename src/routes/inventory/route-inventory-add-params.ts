import { getHostFromHeader } from "../../utils/http";

export const getRouteInventoryAddParams = (
	headers: Headers,
	formData: FormData,
) => {
	const file = formData.get("file");

	if (!(file instanceof File)) {
		throw new Error("Expected 'file' to be a File object");
	}

	return {
		host: getHostFromHeader(headers),
		file,
		name: formData.get("name")?.toString() || file.name || "uploaded",
		quantity: formData.get("quantity")?.toString() || "1",
	};
};
export type UploadParams = ReturnType<typeof getRouteInventoryAddParams>;
