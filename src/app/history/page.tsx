"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryCard } from "@/components/HistoryCard";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { type IAnalysisLog } from "@/lib/models/AnalysisLog";
import { type DeepfakeAnalysisReport } from "@/types/deepfake";

interface HistoryResponse {
  success: boolean;
  data: {
    analyses: IAnalysisLog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
  error?: string;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<IAnalysisLog[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null as number | null,
    prevPage: null as number | null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<string>('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<DeepfakeAnalysisReport | null>(null);

  const fetchHistory = async (page: number = 1, verdict: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (verdict) {
        params.append('verdict', verdict);
      }

      const response = await fetch(`/api/history?${params}`);
      const result: HistoryResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch history');
      }

      if (result.success) {
        setAnalyses(result.data.analyses);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.error || 'Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, selectedVerdict);
  }, [selectedVerdict]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchHistory(newPage, selectedVerdict);
    }
  };

  const handleVerdictFilter = (verdict: string) => {
    setSelectedVerdict(verdict);
    // fetchHistory will be called by useEffect
  };

  const handleViewDetails = (analysis: IAnalysisLog) => {
    // Convert IAnalysisLog to DeepfakeAnalysisReport format
    const reportData: DeepfakeAnalysisReport = {
      reportId: analysis.reportId,
      preparedBy: analysis.preparedBy,
      dateOfAnalysis: analysis.dateOfAnalysis,
      toolModelUsed: analysis.toolModelUsed,
      detectionEngineVersion: analysis.detectionEngineVersion,
      caseOverview: analysis.caseOverview,
      videoFileMetadata: analysis.videoFileMetadata,
      detectionParameters: analysis.detectionParameters,
      frameLevelClassification: analysis.frameLevelClassification,
      overallVerdict: analysis.overallVerdict,
      averageConfidence: analysis.averageConfidence,
      totalFramesAnalyzed: analysis.totalFramesAnalyzed,
      fakeFramesDetected: analysis.fakeFramesDetected,
      realFramesDetected: analysis.realFramesDetected
    };
    setSelectedAnalysis(reportData);
  };

  const handleBackToHistory = () => {
    setSelectedAnalysis(null);
  };

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={handleBackToHistory}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to History
            </button>
          </div>
          <ResultsDisplay report={selectedAnalysis} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analysis History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your deepfake detection analysis history
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Analysis
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Verdict:
            </label>
            <select
              value={selectedVerdict}
              onChange={(e) => handleVerdictFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Results</option>
              <option value="FAKE">Fake</option>
              <option value="REAL">Real</option>
              <option value="INCONCLUSIVE">Inconclusive</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">
                Showing {analyses.length} of {pagination.totalCount} results
                {selectedVerdict && ` (filtered by: ${selectedVerdict})`}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading History</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchHistory(pagination.currentPage, selectedVerdict)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && analyses.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Analysis History</h3>
            <p className="text-gray-600 mb-4">
              {selectedVerdict 
                ? `No analyses found with verdict: ${selectedVerdict}`
                : 'Start analyzing media files to see your history here'
              }
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Analysis
            </Link>
          </div>
        )}

        {/* Analysis Grid */}
        {!loading && !error && analyses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {analyses.map((analysis) => (
                <HistoryCard
                  key={analysis._id?.toString() || analysis.reportId}
                  analysis={analysis}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                      const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                      if (pageNum > pagination.totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            pageNum === pagination.currentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}