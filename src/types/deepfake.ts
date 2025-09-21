export interface VideoMetadata {
  fileName: string;
  fileFormat: string;
  duration: string;
  frameRate: string;
  md5Hash: string;
  dateOfFileCreation: string;
}

export interface DetectionParameters {
  frameSamplingRate: string;
  facialLandmarkDetection: string;
  audioVisualSyncCheck: string;
  classificationThreshold: number;
}

export interface FrameClassification {
  frameNumber: number;
  timestamp: string;
  confidence: number;
  label: "FAKE" | "REAL";
}

export interface DeepfakeAnalysisReport {
  reportId: string;
  preparedBy: string;
  dateOfAnalysis: string;
  toolModelUsed: string;
  detectionEngineVersion: string;
  
  caseOverview: {
    caseReference: string;
    sourceOfVideo: string;
    suspectedContentType: string;
  };
  
  videoFileMetadata: VideoMetadata;
  detectionParameters: DetectionParameters;
  frameLevelClassification: FrameClassification[];
  
  // Summary fields
  overallVerdict: "FAKE" | "REAL" | "INCONCLUSIVE";
  averageConfidence: number;
  totalFramesAnalyzed: number;
  fakeFramesDetected: number;
  realFramesDetected: number;
}

// Schema for Gemini structured output
export const deepfakeDetectionSchema = {
  type: "object" as const,
  properties: {
    reportId: {
      type: "string" as const,
      description: "Unique identifier for this analysis report"
    },
    preparedBy: {
      type: "string" as const,
      description: "AI Analysis System"
    },
    dateOfAnalysis: {
      type: "string" as const,
      description: "Current date in format: DD Month YYYY"
    },
    toolModelUsed: {
      type: "string" as const,
      description: "Gemini 2.5 Pro"
    },
    detectionEngineVersion: {
      type: "string" as const,
      description: "Version of the detection system"
    },
    caseOverview: {
      type: "object" as const,
      properties: {
        caseReference: {
          type: "string" as const,
          description: "Auto-generated case reference number"
        },
        sourceOfVideo: {
          type: "string" as const,
          description: "Source or origin of the uploaded media"
        },
        suspectedContentType: {
          type: "string" as const,
          description: "Type of content being analyzed"
        }
      },
      required: ["caseReference", "sourceOfVideo", "suspectedContentType"]
    },
    videoFileMetadata: {
      type: "object" as const,
      properties: {
        fileName: {
          type: "string" as const,
          description: "Name of the uploaded file"
        },
        fileFormat: {
          type: "string" as const,
          description: "Format of the media file (mp4, jpg, png, etc.)"
        },
        duration: {
          type: "string" as const,
          description: "Duration for videos, or 'N/A' for images"
        },
        frameRate: {
          type: "string" as const,
          description: "Frame rate for videos, or 'N/A' for images"
        },
        md5Hash: {
          type: "string" as const,
          description: "MD5 hash of the file for integrity verification"
        },
        dateOfFileCreation: {
          type: "string" as const,
          description: "Estimated creation date of the media file"
        }
      },
      required: ["fileName", "fileFormat", "duration", "frameRate", "md5Hash", "dateOfFileCreation"]
    },
    detectionParameters: {
      type: "object" as const,
      properties: {
        frameSamplingRate: {
          type: "string" as const,
          description: "Rate at which frames were sampled for analysis"
        },
        facialLandmarkDetection: {
          type: "string" as const,
          description: "Status of facial landmark detection"
        },
        audioVisualSyncCheck: {
          type: "string" as const,
          description: "Status of audio-visual synchronization check"
        },
        classificationThreshold: {
          type: "number" as const,
          description: "Confidence threshold for fake classification"
        }
      },
      required: ["frameSamplingRate", "facialLandmarkDetection", "audioVisualSyncCheck", "classificationThreshold"]
    },
    frameLevelClassification: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          frameNumber: {
            type: "number" as const,
            description: "Frame number in the sequence"
          },
          timestamp: {
            type: "string" as const,
            description: "Timestamp in MM:SS format"
          },
          confidence: {
            type: "number" as const,
            description: "Confidence score for this frame"
          },
          label: {
            type: "string" as const,
            enum: ["FAKE", "REAL"],
            description: "Classification label for this frame"
          }
        },
        required: ["frameNumber", "timestamp", "confidence", "label"]
      },
      description: "Frame-by-frame analysis results"
    },
    overallVerdict: {
      type: "string" as const,
      enum: ["FAKE", "REAL", "INCONCLUSIVE"],
      description: "Overall conclusion of the analysis"
    },
    averageConfidence: {
      type: "number" as const,
      description: "Average confidence score across all analyzed frames"
    },
    totalFramesAnalyzed: {
      type: "number" as const,
      description: "Total number of frames that were analyzed"
    },
    fakeFramesDetected: {
      type: "number" as const,
      description: "Number of frames classified as fake"
    },
    realFramesDetected: {
      type: "number" as const,
      description: "Number of frames classified as real"
    }
  },
  required: [
    "reportId",
    "preparedBy", 
    "dateOfAnalysis",
    "toolModelUsed",
    "detectionEngineVersion",
    "caseOverview",
    "videoFileMetadata",
    "detectionParameters",
    "frameLevelClassification",
    "overallVerdict",
    "averageConfidence",
    "totalFramesAnalyzed",
    "fakeFramesDetected",
    "realFramesDetected"
  ],
  propertyOrdering: [
    "reportId",
    "preparedBy",
    "dateOfAnalysis", 
    "toolModelUsed",
    "detectionEngineVersion",
    "caseOverview",
    "videoFileMetadata",
    "detectionParameters",
    "frameLevelClassification",
    "overallVerdict",
    "averageConfidence",
    "totalFramesAnalyzed",
    "fakeFramesDetected",
    "realFramesDetected"
  ]
};