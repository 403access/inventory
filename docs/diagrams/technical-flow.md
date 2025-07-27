# ⚙️ Technical Flow

```mermaid
flowchart TD
    A[Frontend: React App] --> B[ImageCapture Component]
    B --> C[useImageCapture Hook]
    C --> D[File Selected/Captured]
    
    D --> E[FormData Creation<br/>• file<br/>• name<br/>• quantity<br/>• host]
    
    E --> F[API Call: POST /inventory]
    F --> G[Backend: Bun Server]
    
    G --> H[Route Handler: inventory/add]
    H --> I[Parse FormData<br/>getRouteInventoryAddParams]
    
    I --> J{File validation}
    J -->|Invalid| K[Return 400 Error]
    J -->|Valid| L[Process Upload]
    
    L --> M[File Processing]
    M --> N[Convert HEIC → JPG<br/>Resize if > 512px]
    N --> O[Generate unique filename]
    
    O --> P[Notion Integration]
    P --> Q[Create Notion Page<br/>NotionService.createPage]
    Q --> R[Upload image to Notion<br/>NotionService.uploadFile]
    
    R --> S[Generate QR Label]
    S --> T[Label Generation<br/>• QR Code creation<br/>• Text wrapping<br/>• Canvas rendering]
    T --> U[Save label as PNG]
    
    U --> V[Create Short Link Entry]
    V --> W[Update CSV Database<br/>• Item metadata<br/>• Links<br/>• File paths]
    
    W --> X[Return Success Response<br/>• Item ID<br/>• Links<br/>• File paths]
    
    X --> Y[Frontend: Display Success]
    K --> Z[Frontend: Display Error]
    
    style A fill:#e3f2fd
    style G fill:#f1f8e9
    style P fill:#fff3e0
    style S fill:#fce4ec
    style V fill:#e8eaf6
    style Y fill:#e8f5e8
    style Z fill:#ffebee
```

## Technical Architecture

This diagram illustrates the complete technical stack and data flow:

- **Frontend**: React app with custom hooks for image capture and file handling
- **Backend**: Bun server with modular route handlers and services
- **Processing Pipeline**: File conversion, validation, and optimization
- **External Integration**: Notion API for page creation and file uploads
- **Label Generation**: Canvas-based QR code and text rendering
- **Data Persistence**: Multiple storage layers (CSV, SQLite, file system)
- **Error Handling**: Comprehensive validation and error response flow
