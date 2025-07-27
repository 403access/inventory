import type React from "react";
import type { UploadResponse } from "../../utils/api";
import { StatusMessage } from "../StatusMessage";

interface UploadResultsProps {
    result: UploadResponse;
}

export const UploadResults: React.FC<UploadResultsProps> = ({ result }) => {
    const linkStyle = {
        color: "white",
        textDecoration: "underline" as const,
        opacity: 0.9,
    };

    return (
        <StatusMessage type="success">
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem" }}>
                ✅ Upload Successful!
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <p style={{ margin: 0 }}>
                    <strong>Name:</strong> {result.name}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Quantity:</strong> {result.quantity}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Short Link:</strong>{" "}
                    <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                    >
                        {result.link}
                    </a>
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Notion Page:</strong>{" "}
                    <a
                        href={result.target_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                    >
                        View in Notion
                    </a>
                </p>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <p style={{ margin: "0 0 0.5rem 0" }}>
                    <strong>Generated Files:</strong>
                </p>
                <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                    <li>
                        <a
                            href={result.original}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                        >
                            Original Image
                        </a>
                    </li>
                    <li>
                        <a
                            href={result.converted}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                        >
                            Processed Image
                        </a>
                    </li>
                    <li>
                        <a
                            href={result.label_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                        >
                            QR Label
                        </a>
                    </li>
                </ul>

                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                    <img
                        src={result.label_url}
                        alt="Generated QR Label"
                        style={{
                            maxWidth: "200px",
                            borderRadius: "8px",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                        }}
                    />
                </div>
            </div>
        </StatusMessage>
    );
};
