console.log("API_HOST", import.meta.env.VITE_API_HOST);
console.log("All env vars:", import.meta.env);
const host = import.meta.env.VITE_API_HOST || "http://localhost:3000";

export type UploadInventoryParams = {
	file: File;
	name: string;
	quantity: number;
	host: string;
};

export type UploadResponse = {
	id: string;
	name: string;
	quantity: number;
	original: string;
	converted: string;
	link: string;
	target_link: string;
	label_path: string;
	label_url: string;
	csv_row: any;
};

export const uploadInventoryItem = async (params: UploadInventoryParams): Promise<UploadResponse> => {
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
	console.log("API_HOST", import.meta.env.VITE_API_HOST);

	const res = await fetch(`${host}${url}`);
	if (!res.ok) {
		throw new Error("Failed to fetch uploaded files");
	}
	return res.json();
};
