import type React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface FileSelectionProps {
	onSelectFile: () => void;
}

export const FileSelection: React.FC<FileSelectionProps> = ({
	onSelectFile,
}) => {
	const { colors } = useTheme();

	return (
		<div style={{ marginBottom: "1rem" }}>
			<button
				type="button"
				onClick={onSelectFile}
				style={{
					width: "100%",
					padding: "1rem",
					backgroundColor: colors.primary,
					color: "white",
					border: "none",
					borderRadius: "8px",
					cursor: "pointer",
					fontSize: "1rem",
					fontWeight: "600",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "0.5rem",
					transition: "all 0.3s ease",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = colors.primaryHover;
					e.currentTarget.style.transform = "translateY(-2px)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = colors.primary;
					e.currentTarget.style.transform = "translateY(0)";
				}}
			>
				📷 Choose Photo
			</button>
			<p
				style={{
					fontSize: "0.9rem",
					color: colors.textSecondary,
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
