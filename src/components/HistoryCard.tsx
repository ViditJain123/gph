import { type IAnalysisLog } from "@/lib/models/AnalysisLog";

interface HistoryCardProps {
  analysis: IAnalysisLog;
  onViewDetails?: (analysis: IAnalysisLog) => void;
}

export function HistoryCard({ analysis, onViewDetails }: HistoryCardProps) {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'FAKE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REAL':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INCONCLUSIVE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {analysis.reportId}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDate(analysis.createdAt.toString())}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getVerdictColor(analysis.overallVerdict)}`}>
          {analysis.overallVerdict}
        </div>
      </div>

      {/* File Info */}
      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {analysis.videoFileMetadata.fileName}
          </span>
          <span>{analysis.videoFileMetadata.fileFormat.toUpperCase()}</span>
          {analysis.videoFileMetadata.duration !== 'N/A' && (
            <span>{analysis.videoFileMetadata.duration}</span>
          )}
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Confidence</p>
          <p className={`text-lg font-semibold ${getConfidenceColor(analysis.averageConfidence)}`}>
            {(analysis.averageConfidence * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Frames Analyzed</p>
          <p className="text-lg font-semibold text-gray-900">
            {analysis.totalFramesAnalyzed}
          </p>
        </div>
      </div>

      {/* Frame Analysis Summary */}
      {analysis.totalFramesAnalyzed > 1 && (
        <div className="mb-4">
          <div className="flex space-x-4 text-sm">
            <span className="text-red-600">
              Fake: {analysis.fakeFramesDetected}
            </span>
            <span className="text-green-600">
              Real: {analysis.realFramesDetected}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ 
                width: `${(analysis.fakeFramesDetected / analysis.totalFramesAnalyzed) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {analysis.toolModelUsed}
        </span>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(analysis)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </button>
        )}
      </div>
    </div>
  );
}