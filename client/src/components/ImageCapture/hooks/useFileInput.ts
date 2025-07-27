import { useRef, useState } from "react";

export const useFileInput = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const selectFile = (file: File) => {
		setSelectedFile(file);
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return url;
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			return selectFile(file);
		}
		return null;
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const clearFile = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setSelectedFile(null);
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const cleanup = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
	};

	return {
		selectedFile,
		previewUrl,
		fileInputRef,
		selectFile,
		handleFileChange,
		triggerFileInput,
		clearFile,
		cleanup,
	};
};
