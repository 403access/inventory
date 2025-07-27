import type React from "react";
import { FileSelection } from "./FileSelection";
import { useImageCapture } from "./hooks/useImageCapture";
import { ImagePreview } from "./ImagePreview";

interface ImageCaptureProps {
	onImageChange: (file: File | null, previewUrl: string | null) => void;
	currentFile: File | null;
	currentPreviewUrl: string | null;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({
	onImageChange,
	currentPreviewUrl,
}) => {
	const { fileInputRef, selectFile, handleFileChange, clear } = useImageCapture(
		{ onImageChange },
	);

	return (
		<div>
			<span
				style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
			>
				📷 Add Image:
			</span>

			{currentPreviewUrl ? (
				<ImagePreview
					previewUrl={currentPreviewUrl}
					onChooseFile={selectFile}
					onClear={clear}
				/>
			) : (
				<FileSelection onSelectFile={selectFile} />
			)}

			<input
				ref={fileInputRef}
				id="file"
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				style={{ display: "none" }}
			/>
		</div>
	);
};
