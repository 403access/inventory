# 🗄️ Database & File Flow

```mermaid
flowchart LR
    A[Upload Request] --> B[File Processing]
    
    B --> C[Local Storage]
    C --> D[public/images/<br/>converted-image.jpg]
    C --> E[public/labels/<br/>label_id.png]
    
    B --> F[Notion Database]
    F --> G[Create Page Entry]
    F --> H[Upload Image File]
    
    B --> I[Local Database]
    I --> J[SQLite: inventory.db]
    I --> K[CSV: inventory.csv]
    
    B --> L[Link Generation]
    L --> M[Short Link<br/>olimo.me/inventory/ID]
    L --> N[Target Link<br/>notion.so/INVENTORY-ID]
    
    style C fill:#e1f5fe
    style F fill:#fff3e0
    style I fill:#f3e5f5
    style L fill:#e8f5e8
```

## Data Storage Architecture

This diagram shows how data flows through different storage systems:

- **Local File Storage**: Images and generated labels stored in public directories for web access
- **Notion Integration**: Remote storage with rich page formatting and file attachments
- **Local Database**: Dual persistence with SQLite for structured queries and CSV for simple exports
- **Link Management**: Short link system for easy sharing and access to inventory items

## Storage Benefits

- **Redundancy**: Multiple storage layers ensure data availability
- **Performance**: Local storage for fast access, remote for collaboration
- **Accessibility**: Public directories enable direct file access via URLs
- **Integration**: Notion provides rich UI and collaboration features
