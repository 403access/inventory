import React, { useRef } from "react";

interface CameraViewProps {
    stream: MediaStream | null;
    onCapture: () => void;
    onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
    stream,
    onCapture,
    onCancel
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div style={{ marginBottom: "1rem" }}>
            {/** biome-ignore lint/a11y/useMediaCaption: Camera View and not a video. */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                    backgroundColor: "#000"
                }}
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                    type="button"
                    onClick={onCapture}
                    style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    📸 Capture
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    ❌ Cancel
                </button>
            </div>
        </div>
    );
};
