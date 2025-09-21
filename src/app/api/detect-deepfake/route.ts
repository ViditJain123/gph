import { NextRequest, NextResponse } from "next/server";
import { GeminiClient } from "@/lib/gemini";
import connectToDatabase from "@/lib/mongodb";
import { AnalysisLog } from "@/lib/models/AnalysisLog";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/webm'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" }, 
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 50MB" }, 
        { status: 400 }
      );
    }

    // Validate file type
    const isValidVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isValidImage = ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isValidVideo && !isValidImage) {
      return NextResponse.json(
        { 
          error: "Invalid file type. Supported formats: MP4, AVI, MOV, WebM for videos; JPEG, PNG, WebP for images" 
        }, 
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Initialize Gemini client and analyze
    const geminiClient = new GeminiClient();
    const analysisResult = await geminiClient.analyzeMedia(
      buffer,
      file.name,
      file.type
    );

    // Connect to database and save the analysis log
    try {
      await connectToDatabase();
      
      // Extract client information
      const ipAddress = request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Create analysis log entry
      const analysisLog = new AnalysisLog({
        ...analysisResult,
        ipAddress,
        userAgent
      });

      // Try to save with retry logic for duplicate key errors
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await analysisLog.save();
          console.log(`Analysis log saved with reportId: ${analysisResult.reportId}`);
          break;
        } catch (saveError: unknown) {
          const mongoError = saveError as { code?: number };
          if (mongoError.code === 11000 && retryCount < maxRetries - 1) {
            // Duplicate key error - regenerate reportId and retry
            retryCount++;
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
            const timeStr = now.toISOString().slice(11, 19).replace(/:/g, '');
            const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            const newReportId = `DFVD-${dateStr}-${timeStr}-${randomSuffix}`;
            
            analysisLog.reportId = newReportId;
            analysisResult.reportId = newReportId; // Update the response as well
            console.log(`Retry ${retryCount}: Using new reportId: ${newReportId}`);
          } else {
            throw saveError;
          }
        }
      }
    } catch (dbError) {
      // Log the database error but don't fail the main response
      console.error("Failed to save analysis log to database:", dbError);
      // Continue with the response even if database logging fails
    }

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("Error in deepfake detection API:", error);
    
    // Return appropriate error message
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { error: "API configuration error. Please check server configuration." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Analysis failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during analysis" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const geminiClient = new GeminiClient();
    const isConnected = await geminiClient.testConnection();
    
    return NextResponse.json({
      status: "online",
      geminiConnected: isConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      geminiConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}