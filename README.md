# 📦 Inventory Uploader App

A web app for adding new items to your inventory. 

Add items to your inventory with name, quantity, and photo. Automatically generates Notion pages, QR labels, and tracking links. Print labels as needed.

## 🔄 Workflow

1. **📸 Capture/Select Image**
   - Take a photo using camera
   - Or select a file from storage
   - Auto-preview before upload

2. **📝 Item Details**
   - Input Name (auto-generated from filename)
   - Set Quantity (defaults to 1)

3. **🚀 Processing Pipeline**
   - Create new Notion page with collected data
   - Generate filename based on item name
   - Process and convert image (HEIC → JPG, resize if needed)
   - Upload image to Notion page
   - Generate QR code label for printing

4. **🔗 Link Generation**
   - Short Link: `https://link.olimo.me/inventory/19`
   - Target Link: `https://notion.so/INVENTORY-19`
   - CSV entry with all metadata

5. **📊 Export & Integration**
   - Export CSV for Short.io import
   - Manual or API integration with Short.io

## 🛠 Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh)
- **Database**: SQLite (Bun's built-in)
- **Image Processing**: `sips` (macOS built-in tool)
- **Canvas Drawing**: `node-canvas`
- **QR Code Generation**: `qrcode`
- **Cloud Integration**: Notion API

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Camera API**: MediaStream API
- **File Upload**: Fetch API with FormData

## 📁 Project Structure

```
.
├── src/                          # Backend source code
│   ├── routes/                   # API route handlers
│   │   └── inventory/            # Inventory-specific routes
│   ├── services/                 # Business logic services
│   │   ├── NotionService.ts      # Notion API integration
│   │   ├── UploadService.ts      # File upload handling
│   │   └── LabelService.ts       # Label generation
│   ├── repositories/             # Data access layer
│   │   ├── NotionDatabaseRepository.ts
│   │   ├── NotionPagesRepository.ts
│   │   └── NotionFilesRepository.ts
│   ├── utils/                    # Utility functions
│   │   ├── folders.ts            # Folder management
│   │   └── logger.ts             # Logging system
│   └── database/                 # Database setup
│
├── client/                       # Frontend React app
│   ├── src/
│   │   ├── components/           # React components
│   │   │   └── ImageCapture/     # Camera & file capture
│   │   ├── pages/                # Page components
│   │   │   └── InventoryPage.tsx # Main upload interface
│   │   └── utils/                # Frontend utilities
│   └── dist/                     # Built frontend assets
│
├── public/                       # Generated files
│   ├── images/                   # Processed images
│   ├── labels/                   # QR code labels
│   └── csv/                      # CSV exports
│
├── inventory.csv                 # Main inventory tracking file
└── local.env                     # Environment config (NOT in git)
```

## ⚙️ Setup

### 1. Install Dependencies

Make sure you have [Bun](https://bun.sh) with minimal version `v1.2.3` installed:

```bash
# Install backend dependencies
bun install

# Install frontend dependencies
cd client && bun install
```

### 2. Create Environment File

Create `local.env` in the root directory:

```env
HOST=192.168.178.103 # (defaults to localhost)
NOTION_API_TOKEN=
NOTION_DATABASE_ID=
SHORTIO_API_KEY=
```

Create `.env` at `/client/.env` containing the backend URL.

*Note*: In future we can change the behavior that this is only relevant in dev mode since we serve the production build from the backend and thus it is enough to point to the backend starting with `/` (relative path) instead of a absolute path.

```env
VITE_API_HOST=http://192.168.178.103:3000
```

### 3. Build Frontend

```bash
cd client
bun run build
```

### 4. Start the Server

```bash
bun run start
```

The app will be available at `http://localhost:3000`

## 🌐 Web Interface

### Main Features
- **📸 Camera Capture**: Take photos directly in browser
- **📁 File Upload**: Select images from device storage
- **🖼️ Image Preview**: Preview before upload
- **📝 Smart Forms**: Auto-filled item names from filenames
- **⚡ Real-time Processing**: Live upload progress and results

### Usage
1. Open `http://localhost:3000` in your browser
2. Use "Take Photo" or "Choose File" to select an image
3. Enter item name and quantity
4. Click "Add to Inventory"
5. View generated links and download label

## 📤 API Endpoints

### Upload Item
```bash
POST /inventory
Content-Type: multipart/form-data

curl -X POST \
  -F "file=@Xbox_360_COMPOSITE_AV_CABLE.HEIC" \
  -F "name=Xbox 360 COMPOSITE AV CABLE" \
  -F "quantity=1" \
  -F "host=http://localhost:3000" \
  http://localhost:3000/inventory
```

### Get Files
```bash
GET /files
# Returns list of uploaded files with metadata
```

## 🧠 Features

- ✅ **Web UI**: React-based interface with camera support
- ✅ **Image Processing**: Auto-convert HEIC → JPG, resize to max 512px
- ✅ **QR Labels**: Generate horizontal labels for SUPVAN T50M Pro
- ✅ **Notion Integration**: Create pages, upload images, manage database
- ✅ **SQLite Database**: Track all uploads and metadata
- ✅ **CSV Export**: Generate files for Short.io integration
- ✅ **Link Generation**: Create short links with target URLs
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Error Handling**: Comprehensive logging and error management

## 🖨 SUPVAN T50M Pro Label Printer

Labels are generated as PNG files optimized for horizontal printing:
- **Format**: 50mm width labels
- **Content**: QR code + item name (center-aligned)
- **Location**: `/public/labels/` directory
- **Naming**: `{item-name}-label.png`

Use the SUPVAN app to print directly from the labels folder.

## 🏗️ Architecture

### Backend Services
- **NotionService**: Handles all Notion API interactions
- **UploadService**: Manages file uploads and processing
- **LabelService**: Generates QR code labels
- **Logger**: Configurable logging (console/file/memory)

### Frontend Components
- **InventoryPage**: Main upload interface
- **ImageCapture**: Camera and file selection
- **CameraControls**: Camera interface management
- **FileInput**: File selection handling
- **ImagePreview**: Image preview with actions

### Data Flow
```
Upload File → Process Image → Create Notion Page → 
Generate Label → Update Database → Return Results
```

## 🚧 Roadmap

- [ ] **Notion File URL Expiry**: Permanent accessible links
- [ ] **Label Printing**: Direct printer integration
- [ ] **Search Interface**: Find existing inventory items
- [ ] **Short.io API**: Automatic link creation
- [ ] **Barcode Scanner**: Quick item lookup
- [ ] **Inventory Reports**: Analytics and insights

## 🔐 Security

- Environment variables stored in `local.env` (never committed)
- Notion tokens secured with proper API permissions
- File uploads validated and sanitized
- SQLite database with proper schema validation

## 📄 License

[MIT – © 2025 Oliver Molnar](./LICENSE.md)

---

## 🧪 Testing

```bash
# Test the upload endpoint
curl -X POST \
  -F "file=@test-image.jpg" \
  -F "name=Test Item" \
  -F "quantity=1" \
  -F "host=http://localhost:3000" \
  http://localhost:3000/inventory

# Test the files endpoint
curl http://localhost:3000/files
```

