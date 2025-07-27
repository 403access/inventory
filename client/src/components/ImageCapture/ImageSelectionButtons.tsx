import type React from "react";

interface ImageSelectionButtonsProps {
	onTakePhoto: () => void;
	onSelectFile: () => void;
}

export const ImageSelectionButtons: React.FC<ImageSelectionButtonsProps> = ({
	onTakePhoto,
	onSelectFile,
}) => {
	return (
		<div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
			<button
				type="button"
				onClick={onTakePhoto}
				style={{
					flex: 1,
					padding: "0.75rem",
					backgroundColor: "#28a745",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
				}}
			>
				📸 Take Photo
			</button>
			<span style={{ alignSelf: "center", color: "#666" }}>or</span>
			<button
				type="button"
				onClick={onSelectFile}
				style={{
					flex: 1,
					padding: "0.75rem",
					backgroundColor: "#007bff",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
					textAlign: "center",
				}}
			>
				📁 Choose File
			</button>
		</div>
	);
};
