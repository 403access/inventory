import type React from "react";

interface ImagePreviewProps {
	previewUrl: string;
	onChooseFile: () => void;
	onClear: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
	previewUrl,
	onChooseFile,
	onClear,
}) => {
	return (
		<div style={{ marginBottom: "1rem" }}>
			<img
				src={previewUrl}
				alt="Preview"
				style={{
					width: "100%",
					maxHeight: "300px",
					objectFit: "contain",
					borderRadius: "8px",
					border: "1px solid #ccc",
				}}
			/>
			<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
				<button
					type="button"
					onClick={onChooseFile}
					style={{
						flex: 1,
						padding: "0.5rem",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						fontSize: "0.9rem",
					}}
				>
					📁 Choose Different Photo
				</button>
				<button
					type="button"
					onClick={onClear}
					style={{
						flex: 1,
						padding: "0.5rem",
						backgroundColor: "#dc3545",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						fontSize: "0.9rem",
					}}
				>
					🗑️ Remove
				</button>
			</div>
		</div>
	);
};
