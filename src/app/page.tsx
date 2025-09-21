"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadComponent } from "@/components/UploadComponent";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { type DeepfakeAnalysisReport } from "@/types/deepfake";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<DeepfakeAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (result: DeepfakeAnalysisReport) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Deepfake Detection System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a video or image to analyze it for deepfake content using advanced AI detection for accurate and detailed analysis.
            </p>
          </div>
          <div className="ml-8">
            <Link
              href="/history"
              className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!analysisResult && !isAnalyzing && (
            <UploadComponent 
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Media for Deepfake Content
              </h2>
              <p className="text-gray-600">
                Please wait while our AI system examines your file. This may take a few moments...
              </p>
            </div>
          )}

          {analysisResult && (
            <div>
              <div className="mb-4 text-center">
                <button
                  onClick={handleReset}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Analyze Another File
                </button>
              </div>
              <ResultsDisplay report={analysisResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
