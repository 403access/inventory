# 📊 Inventory Uploader App - Flow Diagrams

This directory contains comprehensive flow diagrams documenting the Inventory Uploader App's architecture, user experience, and technical implementation.

## 📝 Overview

The Inventory Uploader App is a full-stack application that allows users to photograph items, upload them to a Notion database, and generate QR code labels for physical inventory management. The system supports both mobile and desktop platforms with optimized experiences for each.

## 🗂️ Documentation Structure

### User Experience Flows
- **[👤 User Flow](./user-flow.md)** - Complete user journey from app launch to inventory item creation
- **[📱 Mobile vs Desktop Experience](./mobile-desktop-experience.md)** - Platform-specific user interface adaptations

### Technical Architecture
- **[⚙️ Technical Flow](./technical-flow.md)** - End-to-end technical data flow and processing pipeline
- **[🗄️ Database & File Flow](./database-file-flow.md)** - Data storage architecture and file management
- **[🔄 Component Architecture](./component-architecture.md)** - React component structure and relationships

### Specialized Processes
- **[🏷️ Label Generation Flow](./label-generation-flow.md)** - QR code label creation and optimization process

## 🎯 Key Features

- **Cross-Platform Compatibility**: Optimized for both mobile and desktop browsers
- **Image Processing**: HEIC to JPG conversion, automatic resizing, and optimization
- **Notion Integration**: Automated page creation and file uploads to Notion databases
- **QR Code Labels**: Automatic generation of scannable labels with optimized text layout
- **Multiple Storage**: Local file system, SQLite database, CSV exports, and cloud storage
- **Short Links**: Easy sharing system with memorable URLs

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Custom Hooks, Vite
- **Backend**: Bun server, File processing, Canvas API
- **Storage**: Local files, SQLite, CSV, Notion API
- **Labels**: QR code generation, Canvas rendering, PNG export

## 📖 How to Use This Documentation

1. Start with **[User Flow](./user-flow.md)** to understand the user experience
2. Review **[Technical Flow](./technical-flow.md)** for system architecture overview
3. Explore specific flows based on your area of interest:
   - Frontend development → **[Component Architecture](./component-architecture.md)**
   - Data management → **[Database & File Flow](./database-file-flow.md)**
   - Mobile experience → **[Mobile vs Desktop Experience](./mobile-desktop-experience.md)**
   - Label system → **[Label Generation Flow](./label-generation-flow.md)**

Each diagram file includes detailed descriptions and architectural benefits for that specific aspect of the system.
