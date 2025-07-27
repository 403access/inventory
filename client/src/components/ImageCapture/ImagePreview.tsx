import type React from "react";
import { useTheme } from "../../contexts/ThemeContext";

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
	const { colors } = useTheme();

	const buttonBaseStyle = {
		flex: 1,
		padding: "0.75rem",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		fontSize: "0.9rem",
		fontWeight: "500",
		transition: "all 0.3s ease",
	};

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
					border: `1px solid ${colors.border}`,
					backgroundColor: colors.surface,
				}}
			/>
			<div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
				<button
					type="button"
					onClick={onChooseFile}
					style={{
						...buttonBaseStyle,
						backgroundColor: colors.primary,
						color: "white",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = colors.primaryHover;
						e.currentTarget.style.transform = "translateY(-1px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = colors.primary;
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					📁 Choose Different Photo
				</button>
				<button
					type="button"
					onClick={onClear}
					style={{
						...buttonBaseStyle,
						backgroundColor: colors.error,
						color: "white",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#c82333";
						e.currentTarget.style.transform = "translateY(-1px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = colors.error;
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					🗑️ Remove
				</button>
			</div>
		</div>
	);
};
