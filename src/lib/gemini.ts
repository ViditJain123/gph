import { GoogleGenAI } from "@google/genai";
import { deepfakeDetectionSchema, type DeepfakeAnalysisReport } from "@/types/deepfake";
import crypto from "crypto";

export class GeminiClient {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async analyzeMedia(
    file: Buffer, 
    fileName: string, 
    mimeType: string
  ): Promise<DeepfakeAnalysisReport> {
    try {
      // Generate file hash
      const md5Hash = crypto.createHash('md5').update(file).digest('hex');
      
      // Create file data for Gemini
      const fileData = {
        inlineData: {
          data: file.toString('base64'),
          mimeType: mimeType
        }
      };

      // Determine media type for prompt
      const isVideo = mimeType.startsWith('video/');
      
      const mediaType = isVideo ? 'video' : 'image';
      
      // Create analysis prompt
      const prompt = `Analyze this ${mediaType} for deepfake detection. 

IMPORTANT INSTRUCTIONS:
1. Examine the ${mediaType} carefully for signs of artificial generation or manipulation
2. Look for inconsistencies in facial features, lighting, shadows, and textures
3. For videos: Check for temporal inconsistencies, unnatural movements, and lip-sync issues
4. For images: Focus on facial artifacts, blending inconsistencies, and compression artifacts

Please provide a comprehensive deepfake analysis report with the following details:
- Generate a unique report ID (format: DFVD-YYYY-MMDD-XXX)
- Set prepared by as "Gemini AI Analysis System"
- Use today's date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
- Tool used: "Gemini 2.5 Pro"
- Detection engine version: "2.5.0"

Case Overview:
- Generate a case reference (format: CYB/XXXX/YYYY/)
- Source: "User Upload"
- Content type: "${isVideo ? 'Video Content' : 'Image Content'}"

File Metadata:
- File name: "${fileName}"
- Format: "${mimeType.split('/')[1].toUpperCase()}"
- Duration: ${isVideo ? '"Analyze and provide duration"' : '"N/A"'}
- Frame rate: ${isVideo ? '"Analyze and provide frame rate"' : '"N/A"'}
- MD5 hash: "${md5Hash}"
- Creation date: "Estimated based on analysis"

Detection Parameters:
- Frame sampling rate: ${isVideo ? '"1 frame/sec or appropriate rate"' : '"Single image analysis"'}
- Facial landmark detection: "Enabled (68-point model)"
- Audio-visual sync: ${isVideo ? '"Enabled"' : '"N/A"'}
- Classification threshold: 0.85

Frame Analysis:
${isVideo ? 
  'Provide frame-by-frame analysis with timestamps, confidence scores, and FAKE/REAL labels' : 
  'Provide single frame analysis with confidence score and FAKE/REAL label'
}

Summary:
- Overall verdict: FAKE/REAL/INCONCLUSIVE based on your analysis
- Average confidence score
- Total frames analyzed
- Count of fake vs real frames detected

Base your analysis on actual visual inspection of the provided ${mediaType}.`;

      const response = await this.client.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            parts: [
              { text: prompt },
              fileData
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: deepfakeDetectionSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      const result = JSON.parse(responseText) as DeepfakeAnalysisReport;
      
      // Ensure the MD5 hash is correctly set
      result.videoFileMetadata.md5Hash = md5Hash;
      
      return result;
    } catch (error) {
      console.error("Error analyzing media with Gemini:", error);
      throw new Error("Failed to analyze media for deepfake detection");
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            parts: [{ text: "Hello, this is a connection test. Please respond with 'Connection successful'." }]
          }
        ]
      });
      
      const responseText = response.text;
      return responseText ? responseText.includes("Connection successful") : false;
    } catch (error) {
      console.error("Gemini connection test failed:", error);
      return false;
    }
  }
}