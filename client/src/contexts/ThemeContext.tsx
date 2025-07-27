import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeColors {
	background: string;
	surface: string;
	surfaceSecondary: string;
	text: string;
	textSecondary: string;
	border: string;
	primary: string;
	primaryHover: string;
	secondary: string;
	secondaryHover: string;
	success: string;
	error: string;
	warning: string;
	shadow: string;
}

const lightTheme: ThemeColors = {
	background: "#ffffff",
	surface: "#f8f9fa",
	surfaceSecondary: "#e9ecef",
	text: "#212529",
	textSecondary: "#6c757d",
	border: "#dee2e6",
	primary: "#007bff",
	primaryHover: "#0056b3",
	secondary: "#6c757d",
	secondaryHover: "#545b62",
	success: "#28a745",
	error: "#dc3545",
	warning: "#ffc107",
	shadow: "rgba(0, 0, 0, 0.1)",
};

const darkTheme: ThemeColors = {
	background: "#121212",
	surface: "#1e1e1e",
	surfaceSecondary: "#2d2d2d",
	text: "#ffffff",
	textSecondary: "#b3b3b3",
	border: "#404040",
	primary: "#4dabf7",
	primaryHover: "#339af0",
	secondary: "#868e96",
	secondaryHover: "#adb5bd",
	success: "#51cf66",
	error: "#ff6b6b",
	warning: "#ffd43b",
	shadow: "rgba(0, 0, 0, 0.3)",
};

interface ThemeContextType {
	theme: Theme;
	colors: ThemeColors;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		// Check for saved theme in localStorage
		const savedTheme = localStorage.getItem("theme") as Theme;
		if (savedTheme) return savedTheme;

		// Check system preference
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return "dark";
		}

		return "light";
	});

	const colors = theme === "light" ? lightTheme : darkTheme;

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	// Apply theme to document body
	useEffect(() => {
		document.body.style.backgroundColor = colors.background;
		document.body.style.color = colors.text;
		document.body.style.transition =
			"background-color 0.3s ease, color 0.3s ease";
	}, [colors]);

	return (
		<ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
