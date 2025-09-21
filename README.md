# Deepfake Detection System

A Next.js application that uses Google's Gemini 2.5 Pro to detect deepfake content in videos and images.

## Features

- 🎥 **Video Analysis**: Upload MP4, AVI, MOV, WebM files for deepfake detection
- 🖼️ **Image Analysis**: Upload JPEG, PNG, WebP images for deepfake detection  
- 🤖 **AI-Powered**: Uses Gemini 2.5 Pro with structured output for accurate analysis
- 📊 **Detailed Reports**: Frame-by-frame analysis with confidence scores
- 🎯 **Professional Format**: Report format similar to forensic analysis tools
- 🔒 **Secure**: File validation and size limits (max 50MB)

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gph
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Media**: Drag and drop or click to select a video or image file
2. **Analyze**: Click "Analyze for Deepfake" to start the detection process
3. **Review Results**: View the comprehensive analysis report including:
   - Overall verdict (FAKE/REAL/INCONCLUSIVE)
   - Confidence scores
   - Frame-by-frame analysis (for videos)
   - File metadata and detection parameters

## Supported File Types

### Videos
- MP4
- AVI 
- MOV
- WebM

### Images  
- JPEG/JPG
- PNG
- WebP

## API Endpoints

### POST `/api/detect-deepfake`
Analyzes uploaded media for deepfake content.

**Request**: FormData with 'file' field containing the media file

**Response**: 
```json
{
  "success": true,
  "data": {
    "reportId": "DFVD-2025-0921-001",
    "overallVerdict": "FAKE",
    "averageConfidence": 0.89,
    // ... additional report fields
  }
}
```

### GET `/api/detect-deepfake`
Health check endpoint to verify API and Gemini connection status.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini 2.5 Pro with structured output
- **File Handling**: Built-in Next.js file uploads
- **Validation**: Client and server-side file validation

## Project Structure

```
src/
├── app/
│   ├── api/detect-deepfake/     # API endpoint
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── UploadComponent.tsx      # File upload interface
│   └── ResultsDisplay.tsx       # Analysis results display
├── lib/
│   └── gemini.ts               # Gemini API client
└── types/
    └── deepfake.ts             # TypeScript types and schemas
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is for educational and research purposes.
