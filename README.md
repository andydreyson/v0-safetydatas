# SafetyDatas.com

A professional web application for managing and organizing Safety Data Sheets (SDS/Datablad).

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/andydreyson-7364s-projects/v0-safetydatas)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/fyTfQxp7J3H)

## Features

### Document Management
- Upload PDF safety data sheets
- Automatic compound name extraction from filenames
- Edit compound names and add tags
- Search and filter documents
- Delete and manage documents

### Alphabetical Index
- Auto-generated alphabetical organization (A-Z)
- Visual scroll view with letter navigation
- Quick access to all compounds

### Export Functionality
- **Print Index**: Professional A4-optimized print layout for binder filing
  - Cover page with alphabetical overview
  - Detailed index pages per letter
  - Individual document pages
- **CSV Export**: Spreadsheet-compatible document list
- **ZIP Export**: Bulk document download (coming soon)

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks
- **Storage**: Browser localStorage (client-side)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Upload Documents**: Click "Upload PDF" and select your safety data sheets
2. **Manage**: Edit compound names, add tags, and organize your documents
3. **View Index**: Browse the alphabetical index to find documents quickly
4. **Export**: Generate print-ready indexes or export to CSV

## Project Structure

```
v0-safetydatas/
├── app/
│   ├── page.tsx              # Main document management interface
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── index-scroll-view.tsx # Alphabetical index component
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── export-utils.tsx      # Export functionality (PDF, CSV, ZIP)
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Deployment

The application is deployed on Vercel and automatically synced with v0.app:

**Live URL**: [https://v0-safetydatas.vercel.app](https://v0-safetydatas.vercel.app)

**Vercel Dashboard**: [https://vercel.com/andydreyson-7364s-projects/v0-safetydatas](https://vercel.com/andydreyson-7364s-projects/v0-safetydatas)

**v0 Chat**: [https://v0.app/chat/fyTfQxp7J3H](https://v0.app/chat/fyTfQxp7J3H)

## Contributing

For development context and recent changes, see [CLAUDE.md](./CLAUDE.md).

## License

Private project - All rights reserved.
