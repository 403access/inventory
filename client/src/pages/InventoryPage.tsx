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
                        <StatusMessage type="error">❌ Error: {error}</StatusMessage>
                    )}

                    {/* Success Results */}
                    {uploadResult && <UploadResults result={uploadResult} />}
                </div>
            </div>
        </Page>
    );
};
