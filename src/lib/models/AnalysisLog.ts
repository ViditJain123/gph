import mongoose from 'mongoose';
import { type DeepfakeAnalysisReport } from '@/types/deepfake';

export interface IAnalysisLog extends DeepfakeAnalysisReport {
  _id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

const FrameClassificationSchema = new mongoose.Schema({
  frameNumber: { type: Number, required: true },
  timestamp: { type: String, required: true },
  confidence: { type: Number, required: true },
  label: { type: String, enum: ['FAKE', 'REAL'], required: true }
}, { _id: false });

const CaseOverviewSchema = new mongoose.Schema({
  caseReference: { type: String, required: true },
  sourceOfVideo: { type: String, required: true },
  suspectedContentType: { type: String, required: true }
}, { _id: false });

const VideoFileMetadataSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileFormat: { type: String, required: true },
  duration: { type: String, required: true },
  frameRate: { type: String, required: true },
  md5Hash: { type: String, required: true },
  dateOfFileCreation: { type: String, required: true }
}, { _id: false });

const DetectionParametersSchema = new mongoose.Schema({
  frameSamplingRate: { type: String, required: true },
  facialLandmarkDetection: { type: String, required: true },
  audioVisualSyncCheck: { type: String, required: true },
  classificationThreshold: { type: Number, required: true }
}, { _id: false });

const AnalysisLogSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  preparedBy: { type: String, required: true },
  dateOfAnalysis: { type: String, required: true },
  toolModelUsed: { type: String, required: true },
  detectionEngineVersion: { type: String, required: true },
  caseOverview: { type: CaseOverviewSchema, required: true },
  videoFileMetadata: { type: VideoFileMetadataSchema, required: true },
  detectionParameters: { type: DetectionParametersSchema, required: true },
  frameLevelClassification: [FrameClassificationSchema],
  overallVerdict: { 
    type: String, 
    enum: ['FAKE', 'REAL', 'INCONCLUSIVE'], 
    required: true 
  },
  averageConfidence: { type: Number, required: true },
  totalFramesAnalyzed: { type: Number, required: true },
  fakeFramesDetected: { type: Number, required: true },
  realFramesDetected: { type: Number, required: true },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Add indexes for efficient querying
AnalysisLogSchema.index({ createdAt: -1 }); // For chronological ordering
AnalysisLogSchema.index({ reportId: 1 }); // For unique report lookup
AnalysisLogSchema.index({ overallVerdict: 1 }); // For filtering by verdict
AnalysisLogSchema.index({ 'videoFileMetadata.md5Hash': 1 }); // For duplicate detection

export const AnalysisLog = mongoose.models.AnalysisLog || mongoose.model<IAnalysisLog>('AnalysisLog', AnalysisLogSchema);