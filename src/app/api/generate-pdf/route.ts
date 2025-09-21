import { NextRequest, NextResponse } from "next/server";
import { type DeepfakeAnalysisReport } from "@/types/deepfake";
import { jsPDF } from "jspdf";

export async function POST(request: NextRequest) {
  try {
    const { report }: { report: DeepfakeAnalysisReport } = await request.json();

    if (!report) {
      return NextResponse.json(
        { error: "No report data provided" }, 
        { status: 400 }
      );
    }

    // Create PDF document
    const pdf = new jsPDF();
    let yPos = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pdf.internal.pageSize.width - 2 * margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPos + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = 20;
      }
    };

    // Helper function to add wrapped text
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * (fontSize * 0.35); // Approximate line height
    };

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Deepfake Analysis Report", margin, yPos);
    yPos += 15;

    // Report ID and Date
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Report ID: ${report.reportId}`, margin, yPos);
    pdf.text(`Date: ${report.dateOfAnalysis}`, margin + 100, yPos);
    yPos += 15;

    // Overall Verdict
    checkPageBreak(30);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Overall Verdict", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(14);
    const verdictColor = report.overallVerdict === 'FAKE' ? [255, 0, 0] : 
                        report.overallVerdict === 'REAL' ? [0, 128, 0] : [255, 165, 0];
    pdf.setTextColor(verdictColor[0], verdictColor[1], verdictColor[2]);
    pdf.text(report.overallVerdict, margin, yPos);
    pdf.setTextColor(0, 0, 0); // Reset to black
    yPos += 10;

    pdf.setFontSize(12);
    pdf.text(`Average Confidence: ${(report.averageConfidence * 100).toFixed(1)}%`, margin, yPos);
    yPos += 20;

    // Summary Statistics
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Analysis Summary", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Frames Analyzed: ${report.totalFramesAnalyzed}`, margin, yPos);
    yPos += 8;
    pdf.text(`Fake Frames Detected: ${report.fakeFramesDetected}`, margin, yPos);
    yPos += 8;
    pdf.text(`Real Frames Detected: ${report.realFramesDetected}`, margin, yPos);
    yPos += 8;
    pdf.text(`Fake Ratio: ${((report.fakeFramesDetected / report.totalFramesAnalyzed) * 100).toFixed(1)}%`, margin, yPos);
    yPos += 20;

    // Temporal Consistency (if available)
    if (report.temporalConsistency) {
      checkPageBreak(40);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Temporal Consistency Analysis", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Consistency Score: ${report.temporalConsistency.score.toFixed(2)} / 1.0`, margin, yPos);
      yPos += 8;
      const interpretationHeight = addWrappedText(
        `Interpretation: ${report.temporalConsistency.interpretation}`, 
        margin, yPos, maxWidth
      );
      yPos += interpretationHeight + 10;
    }

    // Audio-Visual Sync (if available)
    if (report.audioVisualSync) {
      checkPageBreak(40);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Audio-Visual Sync Analysis", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Deviation Index: ${report.audioVisualSync.deviationIndex.toFixed(2)}`, margin, yPos);
      yPos += 8;
      const observationHeight = addWrappedText(
        `Observation: ${report.audioVisualSync.observation}`, 
        margin, yPos, maxWidth
      );
      yPos += observationHeight + 10;
    }

    // Detailed Summary (if available)
    if (report.detailedSummary) {
      checkPageBreak(60);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Detailed Analysis Summary", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Model Confidence: ${(report.detailedSummary.confidenceScore * 100).toFixed(1)}%`, margin, yPos);
      yPos += 8;
      pdf.text(`Operational Threshold: ${(report.detailedSummary.operationalThreshold * 100).toFixed(1)}%`, margin, yPos);
      yPos += 10;
      
      const summaryHeight = addWrappedText(
        report.detailedSummary.content, 
        margin, yPos, maxWidth
      );
      yPos += summaryHeight + 15;
    }

    // Case Overview
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Case Overview", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Case Reference: ${report.caseOverview.caseReference}`, margin, yPos);
    yPos += 8;
    pdf.text(`Source: ${report.caseOverview.sourceOfVideo}`, margin, yPos);
    yPos += 8;
    pdf.text(`Content Type: ${report.caseOverview.suspectedContentType}`, margin, yPos);
    yPos += 20;

    // File Metadata
    checkPageBreak(60);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("File Metadata", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`File Name: ${report.videoFileMetadata.fileName}`, margin, yPos);
    yPos += 8;
    pdf.text(`Format: ${report.videoFileMetadata.fileFormat}`, margin, yPos);
    yPos += 8;
    pdf.text(`Duration: ${report.videoFileMetadata.duration}`, margin, yPos);
    yPos += 8;
    pdf.text(`Frame Rate: ${report.videoFileMetadata.frameRate}`, margin, yPos);
    yPos += 8;
    pdf.text(`Creation Date: ${report.videoFileMetadata.dateOfFileCreation}`, margin, yPos);
    yPos += 8;
    
    // MD5 Hash on new line if needed
    const hashText = `MD5 Hash: ${report.videoFileMetadata.md5Hash}`;
    if (hashText.length > 50) {
      checkPageBreak(16);
      const hashHeight = addWrappedText(hashText, margin, yPos, maxWidth, 10);
      yPos += hashHeight + 10;
    } else {
      pdf.text(hashText, margin, yPos);
      yPos += 20;
    }

    // Detection Parameters
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detection Parameters", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Frame Sampling Rate: ${report.detectionParameters.frameSamplingRate}`, margin, yPos);
    yPos += 8;
    pdf.text(`Facial Landmark Detection: ${report.detectionParameters.facialLandmarkDetection}`, margin, yPos);
    yPos += 8;
    pdf.text(`Audio-Visual Sync Check: ${report.detectionParameters.audioVisualSyncCheck}`, margin, yPos);
    yPos += 8;
    pdf.text(`Classification Threshold: ${report.detectionParameters.classificationThreshold}`, margin, yPos);
    yPos += 20;

    // Frame-Level Classification (summary only due to space constraints)
    if (report.frameLevelClassification.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Frame-Level Classification Summary", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Total classified frames: ${report.frameLevelClassification.length}`, margin, yPos);
      yPos += 8;
      
      const highConfidenceFrames = report.frameLevelClassification.filter(f => f.confidence > 0.8);
      pdf.text(`High confidence frames (>80%): ${highConfidenceFrames.length}`, margin, yPos);
      yPos += 8;
      
      const fakeFrames = report.frameLevelClassification.filter(f => f.label === 'FAKE');
      pdf.text(`Frames classified as FAKE: ${fakeFrames.length}`, margin, yPos);
      yPos += 20;
    }

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated by ${report.preparedBy} • ${report.toolModelUsed} v${report.detectionEngineVersion}`, 
        margin, 
        pageHeight - 10
      );
      pdf.text(
        `Page ${i} of ${totalPages}`, 
        pdf.internal.pageSize.width - margin - 30, 
        pageHeight - 10
      );
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="deepfake-analysis-${report.reportId}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}