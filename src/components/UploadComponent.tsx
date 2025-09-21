"use client";

import { useState, useCallback, useMemo } from "react";
import { type DeepfakeAnalysisReport } from "@/types/deepfake";

interface UploadComponentProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: DeepfakeAnalysisReport) => void;
}

export function UploadComponent({ onAnalysisStart, onAnalysisComplete }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = useMemo(() => [
    'video/mp4', 'video/avi', 'video/mov', 'video/webm',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
  ], []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelection = useCallback((selectedFile: File) => {
    setError(null);

    // Validate file type
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a video (MP4, AVI, MOV, WebM) or image (JPEG, PNG, WebP).");
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size too large. Maximum size is 50MB.");
      return;
    }

    setFile(selectedFile);
  }, [acceptedTypes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelection(droppedFiles[0]);
    }
  }, [handleFileSelection]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelection(selectedFiles[0]);
    }
  }, [handleFileSelection]);

  const handleAnalyze = async () => {
    if (!file) return;

    setError(null);
    onAnalysisStart();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/detect-deepfake', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed');
      }

      if (result.success && result.data) {
        onAnalysisComplete(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // Reset analysis state on error
      setFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('image/')) return '🖼️';
    return '📁';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Upload Media for Analysis
      </h2>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        {!file ? (
          <div>
            <div className="text-4xl mb-4">📤</div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-gray-600">
              Supports: Videos (MP4, AVI, MOV, WebM) and Images (JPEG, PNG, WebP)
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Maximum file size: 50MB
            </p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">{getFileTypeIcon(file.type)}</div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {file.name}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setError(null);
              }}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Remove file
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Analyze Button */}
      {file && !error && (
        <div className="mt-6 text-center">
          <button
            onClick={handleAnalyze}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg"
          >
            Analyze for Deepfake
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-3">What happens next?</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Your file will be securely analyzed</li>
          <li>• Frame-by-frame analysis for videos, comprehensive analysis for images</li>
          <li>• Detection of facial inconsistencies, temporal artifacts, and manipulation signs</li>
          <li>• Detailed report with confidence scores and technical analysis</li>
        </ul>
      </div>
    </div>
  );
}