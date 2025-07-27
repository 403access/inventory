import type React from "react";

interface FileSelectionProps {
	onSelectFile: () => void;
}

export const FileSelection: React.FC<FileSelectionProps> = ({
	onSelectFile,
}) => {
	return (
		<div style={{ marginBottom: "1rem" }}>
			<button
				type="button"
				onClick={onSelectFile}
				style={{
					width: "100%",
					padding: "1rem",
					backgroundColor: "#007bff",
					color: "white",
					border: "none",
					borderRadius: "8px",
					cursor: "pointer",
					fontSize: "1rem",
					fontWeight: "bold",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "0.5rem",
				}}
			>
				📷 Choose Photo
			</button>
			<p
				style={{
					fontSize: "0.9rem",
					color: "#666",
					textAlign: "center",
					marginTop: "0.5rem",
					marginBottom: 0,
				}}
			>
				Select from gallery or take a new photo
			</p>
		</div>
	);
};
