import { useEffect } from "react";
import { useFileInput } from "./useFileInput";

interface UseImageCaptureProps {
	onImageChange: (file: File | null, previewUrl: string | null) => void;
}

export const useImageCapture = ({ onImageChange }: UseImageCaptureProps) => {
	const fileInput = useFileInput();

	const handleFileSelect = () => {
		fileInput.triggerFileInput();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const previewUrl = fileInput.selectFile(file);
			onImageChange(file, previewUrl);
		}
	};

	const handleClear = () => {
		fileInput.clearFile();
		onImageChange(null, null);
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			fileInput.cleanup();
		};
	}, [fileInput.cleanup]);

	return {
		// File state
		fileInputRef: fileInput.fileInputRef,
		currentFile: fileInput.selectedFile,
		currentPreviewUrl: fileInput.previewUrl,
		
		// Actions
		selectFile: handleFileSelect,
		handleFileChange,
		clear: handleClear,
	};
};
