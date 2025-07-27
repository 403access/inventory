import type React from "react";
import { useState } from "react";
import { ImageCapture } from "../components/ImageCapture";
import { Page } from "../components/Page";
import { type UploadResponse, uploadInventoryItem } from "../utils/api";

export const InventoryPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (
        newFile: File | null,
        newPreviewUrl: string | null,
    ) => {
        setFile(newFile);
        setPreviewUrl(newPreviewUrl);

        // Auto-generate name from file if empty
        if (newFile && !name) {
            if (newFile.name.startsWith("photo-")) {
                // For captured photos, use timestamp
                setName(`Photo ${new Date().toLocaleString()}`);
            } else {
                // For uploaded files, use filename
                const fileName = newFile.name.split(".")[0];
                setName(fileName);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !name) {
            setError("Please select a file and enter a name");
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadResult(null);

        try {
            const result = await uploadInventoryItem({
                file,
                name,
                quantity,
                host: window.location.origin,
            });

            setUploadResult(result);

            // Reset form
            setFile(null);
            setName("");
            setQuantity(1);
            setPreviewUrl(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Page
            title="🗃️ Inventory Upload"
            isLoading={isUploading}
            isError={!!error}
            error={error ? new Error(error) : null}
            render={() => null}
        >
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    {/* Image Capture Component */}
                    <ImageCapture
                        onImageChange={handleImageChange}
                        currentFile={file}
                        currentPreviewUrl={previewUrl}
                    />

                    <div>
                        <label
                            htmlFor="name"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "bold",
                            }}
                        >
                            🏷️ Item Name:
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter item name"
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "1rem",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="quantity"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "bold",
                            }}
                        >
                            🔢 Quantity:
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "1rem",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading || !file || !name}
                        style={{
                            padding: "1rem",
                            backgroundColor:
                                isUploading || !file || !name ? "#ccc" : "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            cursor: isUploading || !file || !name ? "not-allowed" : "pointer",
                        }}
                    >
                        {isUploading ? "📤 Uploading..." : "📦 Add to Inventory"}
                    </button>
                </form>

                {error && (
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "1rem",
                            backgroundColor: "#fee",
                            border: "1px solid #fcc",
                            borderRadius: "4px",
                            color: "#d00",
                        }}
                    >
                        ❌ Error: {error}
                    </div>
                )}

                {uploadResult && (
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "1rem",
                            backgroundColor: "#efe",
                            border: "1px solid #cfc",
                            borderRadius: "4px",
                            color: "#060",
                        }}
                    >
                        <h3>✅ Upload Successful!</h3>
                        <p>
                            <strong>Name:</strong> {uploadResult.name}
                        </p>
                        <p>
                            <strong>Quantity:</strong> {uploadResult.quantity}
                        </p>
                        <p>
                            <strong>Short Link:</strong>{" "}
                            <a
                                href={uploadResult.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {uploadResult.link}
                            </a>
                        </p>
                        <p>
                            <strong>Notion Page:</strong>{" "}
                            <a
                                href={uploadResult.target_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View in Notion
                            </a>
                        </p>
                        <p>
                            <strong>Images:</strong>
                        </p>
                        <ul>
                            <li>
                                <a
                                    href={uploadResult.original}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Original Image
                                </a>
                            </li>
                            <li>
                                <a
                                    href={uploadResult.converted}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Converted Image
                                </a>
                            </li>
                            <img src={uploadResult.label_url} alt="Label" style={{ maxWidth: "100%" }} />
                            <li>
                                <a
                                    href={uploadResult.label_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Label Image
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </Page>
    );
};
