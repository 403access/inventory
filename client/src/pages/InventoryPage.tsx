import { ImageCapture } from "../components/ImageCapture";
import { InventoryForm } from "../components/InventoryForm";
import { Page } from "../components/Page";
import { StatusMessage } from "../components/StatusMessage";
import { UploadResults } from "../components/UploadResults";
import { useInventoryUpload } from "../hooks/useInventoryUpload";

export const InventoryPage = () => {
    const {
        file,
        name,
        quantity,
        isUploading,
        uploadResult,
        error,
        previewUrl,
        canSubmit,
        setName,
        setQuantity,
        handleImageChange,
        handleSubmit,
        clearError,
        retry,
    } = useInventoryUpload();

    return (
        <Page
            title="🗃️ Inventory Upload"
            isLoading={isUploading}
            isError={!!error}
            error={error ? new Error(error) : null}
            render={() => null}
        >
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Image Upload Section */}
                    <ImageCapture
                        onImageChange={handleImageChange}
                        currentFile={file}
                        currentPreviewUrl={previewUrl}
                    />

                    {/* Form Section */}
                    <InventoryForm
                        name={name}
                        quantity={quantity}
                        onNameChange={setName}
                        onQuantityChange={setQuantity}
                        onSubmit={handleSubmit}
                        isSubmitting={isUploading}
                        canSubmit={canSubmit}
                    />

                    {/* Error Message */}
                    {error && (
                        <StatusMessage type="error">
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>❌ Error: {error}</div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        type="button"
                                        onClick={retry}
                                        disabled={!canSubmit}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: canSubmit ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)",
                                            color: canSubmit ? "#dc3545" : "rgba(255, 255, 255, 0.7)",
                                            border: "1px solid rgba(255, 255, 255, 0.3)",
                                            borderRadius: "6px",
                                            cursor: canSubmit ? "pointer" : "not-allowed",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                        }}
                                    >
                                        🔄 Retry
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearError}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                                            color: "white",
                                            border: "1px solid rgba(255, 255, 255, 0.3)",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        ✖️ Dismiss
                                    </button>
                                </div>
                            </div>
                        </StatusMessage>
                    )}

                    {/* Success Results */}
                    {uploadResult && <UploadResults result={uploadResult} />}
                </div>
            </div>
        </Page>
    );
};
