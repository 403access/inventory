import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { UploadResponse } from "../utils/api";
import { uploadInventoryItem } from "../utils/api";

interface UploadInventoryParams {
	file: File;
	name: string;
	quantity: number;
	host: string;
}

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
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const uploadMutation = useMutation({
		mutationKey: ["upload-inventory-item"],
		mutationFn: async (params: UploadInventoryParams) => {
			return await uploadInventoryItem(params);
		},
		onSuccess: (result) => {
			onSuccess?.(result);
			// Reset form on success
			setFile(null);
			setName("");
			setQuantity(1);
			setPreviewUrl(null);
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error ? error.message : "An error occurred";
			onError?.(errorMessage);
		},
	});

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
			onError?.(errorMessage);
			return;
		}

		uploadMutation.mutate({
			file,
			name,
			quantity,
			host: window.location.origin,
		});
	};

	const canSubmit = !uploadMutation.isPending && !!file && !!name;

	return {
		// State
		file,
		name,
		quantity,
		previewUrl,
		canSubmit,

		// Mutation state
		isUploading: uploadMutation.isPending,
		uploadResult: uploadMutation.data || null,
		error: uploadMutation.error
			? uploadMutation.error instanceof Error
				? uploadMutation.error.message
				: "An error occurred"
			: null,
		isSuccess: uploadMutation.isSuccess,
		isError: uploadMutation.isError,

		// Actions
		setName,
		setQuantity,
		handleImageChange,
		handleSubmit,
		clearError: uploadMutation.reset,
		clearResult: uploadMutation.reset,
		retry: () => {
			if (file && name) {
				uploadMutation.mutate({
					file,
					name,
					quantity,
					host: window.location.origin,
				});
			}
		},
	};
};
