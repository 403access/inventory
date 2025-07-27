# 🔄 Component Architecture

```mermaid
flowchart TD
    A[InventoryPage] --> B[ImageCapture]
    B --> C[useImageCapture hook]
    
    C --> D[useFileInput hook]
    C --> E[File state management]
    
    B --> F{Current State}
    F -->|No image| G[FileSelection]
    F -->|Image selected| H[ImagePreview]
    
    G --> I[Choose Photo Button]
    H --> J[Image Display<br/>Choose Different<br/>Remove]
    
    A --> K[Form Controls]
    K --> L[Name Input]
    K --> M[Quantity Input]
    K --> N[Submit Button]
    
    A --> O[API Integration]
    O --> P[uploadInventoryItem]
    P --> Q[Backend Processing]
    
    style A fill:#e3f2fd
    style B fill:#f1f8e9
    style C fill:#fff3e0
    style O fill:#fce4ec
```

## React Component Structure

This diagram illustrates the modular React component architecture:

- **Page Level**: `InventoryPage` as the main container component
- **Feature Components**: `ImageCapture` handles all image-related functionality
- **Custom Hooks**: Separation of concerns with `useImageCapture` and `useFileInput`
- **Conditional Rendering**: State-based UI switching between file selection and preview
- **API Integration**: Clean separation between UI components and backend communication

## Architecture Benefits

- **Reusability**: Custom hooks can be used across multiple components
- **Maintainability**: Clear separation of concerns and single responsibility
- **Testability**: Each component and hook can be tested independently
- **State Management**: Centralized file handling logic in custom hooks
