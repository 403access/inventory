import React from "react";

interface ErrorDisplayProps {
    error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    if (!error) return null;
    
    return (
        <div style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#d00",
            fontSize: "0.9rem"
        }}>
            ❌ {error}
        </div>
    );
};
