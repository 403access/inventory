import type React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface StatusMessageProps {
    type: "error" | "success";
    children: React.ReactNode;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ type, children }) => {
    const { colors } = useTheme();

    const backgroundColor = type === "error" ? colors.error : colors.success;

    return (
        <div
            style={{
                marginTop: "1.5rem",
                padding: "1.5rem",
                backgroundColor,
                border: `1px solid ${backgroundColor}`,
                borderRadius: "12px",
                color: "white",
                boxShadow: `0 4px 12px ${colors.shadow}`,
            }}
        >
            {children}
        </div>
    );
};
