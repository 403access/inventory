import type { InventoryAddResponse } from "../../../server/src/routes/inventory/route-inventory-add";
import type { UploadParams } from "../../../server/src/routes/inventory/route-inventory-add-params";

const host = "";

export const uploadInventoryItem = async (
	params: UploadParams,
): Promise<InventoryAddResponse> => {
	const formData = new FormData();
	formData.append("file", params.file);
	formData.append("name", params.name);
	formData.append("quantity", params.quantity.toString());
	formData.append("host", params.host);

	const response = await fetch("/inventory", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Upload failed");
	}

	return response.json();
};

export const fetchFiles = async <T>(url: string): Promise<T> => {
	const res = await fetch(`${host}${url}`);
	if (!res.ok) {
		throw new Error("Failed to fetch uploaded files");
	}
	return res.json();
};
