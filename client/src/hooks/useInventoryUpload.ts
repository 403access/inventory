import { useState } from "react";
import type { UploadResponse } from "../utils/api";
import { uploadInventoryItem } from "../utils/api";

interface UseInventoryUploadProps {
	onSuccess?: (result: UploadResponse) => void;
	onError?: (error: string) => void;
}

export const useInventoryUpload = ({
	onSuccess,
	onError,
}: UseInventoryUploadProps = {}) => {
	const [file, setFile] = useState<File | null>(null);
	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleImageChange = (
		newFile: File | null,
		newPreviewUrl: string | null,
	) => {
		setFile(newFile);
		setPreviewUrl(newPreviewUrl);

		// Auto-generate name from file if empty
		if (newFile && !name) {
			if (newFile.name.startsWith("photo-")) {
				// For captured photos, use timestamp
				setName(`Photo ${new Date().toLocaleString()}`);
			} else {
				// For uploaded files, use filename
				const fileName = newFile.name.split(".")[0];
				setName(fileName);
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file || !name) {
			const errorMessage = "Please select a file and enter a name";
			setError(errorMessage);
			onError?.(errorMessage);
			return;
		}

		setIsUploading(true);
		setError(null);
		setUploadResult(null);

		try {
			const result = await uploadInventoryItem({
				file,
				name,
				quantity,
				host: window.location.origin,
			});

			setUploadResult(result);
			onSuccess?.(result);

			// Reset form
			setFile(null);
			setName("");
			setQuantity(1);
			setPreviewUrl(null);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An error occurred";
			setError(errorMessage);
			onError?.(errorMessage);
		} finally {
			setIsUploading(false);
		}
	};

	const clearError = () => setError(null);
	const clearResult = () => setUploadResult(null);

	const canSubmit = !isUploading && !!file && !!name;

	return {
		// State
		file,
		name,
		quantity,
		isUploading,
		uploadResult,
		error,
		previewUrl,
		canSubmit,

		// Actions
		setName,
		setQuantity,
		handleImageChange,
		handleSubmit,
		clearError,
		clearResult,
	};
};
