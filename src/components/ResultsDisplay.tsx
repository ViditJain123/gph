import { type DeepfakeAnalysisReport } from "@/types/deepfake";

interface ResultsDisplayProps {
  report: DeepfakeAnalysisReport;
}

export function ResultsDisplay({ report }: ResultsDisplayProps) {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'FAKE': return 'text-red-600 bg-red-50 border-red-200';
      case 'REAL': return 'text-green-600 bg-green-50 border-green-200';
      case 'INCONCLUSIVE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-red-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreColor = (score: number, threshold = 0.5) => {
    if (score >= threshold) return 'text-green-600';
    return 'text-red-600';
  };

  const formatConfidence = (confidence: number) => {
    return (confidence * 100).toFixed(1) + '%';
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `deepfake-analysis-${report.reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Deepfake Analysis Report
            </h2>
            <div className="mt-2 text-center text-sm text-gray-600">
              Report ID: {report.reportId} | {report.dateOfAnalysis}
            </div>
          </div>
          <button
            onClick={downloadPDF}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Overall Verdict */}
      <div className="px-6 py-6 border-b">
        <div className="text-center">
          <div className={`inline-block px-6 py-3 rounded-lg border-2 ${getVerdictColor(report.overallVerdict)}`}>
            <div className="text-lg font-semibold">Overall Verdict</div>
            <div className="text-2xl font-bold mt-1">{report.overallVerdict}</div>
          </div>
          <div className="mt-4 text-lg">
            Average Confidence: <span className={`font-bold ${getConfidenceColor(report.averageConfidence)}`}>
              {formatConfidence(report.averageConfidence)}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="px-6 py-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{report.totalFramesAnalyzed}</div>
            <div className="text-sm text-blue-800">Total Frames</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{report.fakeFramesDetected}</div>
            <div className="text-sm text-red-800">Fake Frames</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{report.realFramesDetected}</div>
            <div className="text-sm text-green-800">Real Frames</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {((report.fakeFramesDetected / report.totalFramesAnalyzed) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-800">Fake Ratio</div>
          </div>
        </div>
      </div>

      {/* Case Overview */}
      <div className="px-6 py-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Case Reference:</span>
            <div className="mt-1 text-gray-900">{report.caseOverview.caseReference}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Source:</span>
            <div className="mt-1 text-gray-900">{report.caseOverview.sourceOfVideo}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Content Type:</span>
            <div className="mt-1 text-gray-900">{report.caseOverview.suspectedContentType}</div>
          </div>
        </div>
      </div>

      {/* File Metadata */}
      <div className="px-6 py-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">File Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">File Name:</span>
            <div className="mt-1 text-gray-900 break-all">{report.videoFileMetadata.fileName}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Format:</span>
            <div className="mt-1 text-gray-900">{report.videoFileMetadata.fileFormat}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Duration:</span>
            <div className="mt-1 text-gray-900">{report.videoFileMetadata.duration}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Frame Rate:</span>
            <div className="mt-1 text-gray-900">{report.videoFileMetadata.frameRate}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">MD5 Hash:</span>
            <div className="mt-1 text-gray-900 font-mono text-xs break-all">
              {report.videoFileMetadata.md5Hash}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Creation Date:</span>
            <div className="mt-1 text-gray-900">{report.videoFileMetadata.dateOfFileCreation}</div>
          </div>
        </div>
      </div>

      {/* Detection Parameters */}
      <div className="px-6 py-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Frame Sampling Rate:</span>
            <div className="mt-1 text-gray-900">{report.detectionParameters.frameSamplingRate}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Facial Landmark Detection:</span>
            <div className="mt-1 text-gray-900">{report.detectionParameters.facialLandmarkDetection}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Audio-Visual Sync Check:</span>
            <div className="mt-1 text-gray-900">{report.detectionParameters.audioVisualSyncCheck}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Classification Threshold:</span>
            <div className="mt-1 text-gray-900">{report.detectionParameters.classificationThreshold}</div>
          </div>
        </div>
      </div>

      {/* Advanced Analysis - Temporal Consistency */}
      {report.temporalConsistency && (
        <div className="px-6 py-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temporal Consistency Analysis</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Consistency Score:</span>
              <span className={`text-xl font-bold ${getScoreColor(report.temporalConsistency.score, 0.7)}`}>
                {report.temporalConsistency.score.toFixed(2)} / 1.0
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <strong>Interpretation:</strong> {report.temporalConsistency.interpretation}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analysis - Audio-Visual Sync */}
      {report.audioVisualSync && (
        <div className="px-6 py-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio-Visual Sync Analysis</h3>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Deviation Index:</span>
              <span className={`text-xl font-bold ${getScoreColor(1 - report.audioVisualSync.deviationIndex, 0.7)}`}>
                {report.audioVisualSync.deviationIndex.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <strong>Observation:</strong> {report.audioVisualSync.observation}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Summary */}
      {report.detailedSummary && (
        <div className="px-6 py-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Model Confidence Score</div>
                <div className={`text-2xl font-bold ${getConfidenceColor(report.detailedSummary.confidenceScore)}`}>
                  {formatConfidence(report.detailedSummary.confidenceScore)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Operational Threshold</div>
                <div className="text-2xl font-bold text-gray-700">
                  {formatConfidence(report.detailedSummary.operationalThreshold)}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {report.detailedSummary.content}
            </div>
          </div>
        </div>
      )}

      {/* Frame Level Classification */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frame-Level Classification</h3>
        {report.frameLevelClassification.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Frame #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Label
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.frameLevelClassification.map((frame, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 border-r">
                      {frame.frameNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r">
                      {frame.timestamp}
                    </td>
                    <td className="px-4 py-3 text-sm border-r">
                      <span className={getConfidenceColor(frame.confidence)}>
                        {formatConfidence(frame.confidence)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        frame.label === 'FAKE' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {frame.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No frame-level data available
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
        Generated by {report.preparedBy} • {report.toolModelUsed} v{report.detectionEngineVersion}
      </div>
    </div>
  );
}