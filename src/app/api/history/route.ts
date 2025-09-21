import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { AnalysisLog } from "@/lib/models/AnalysisLog";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const verdict = searchParams.get('verdict'); // Optional filter by verdict

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build query filter
    const filter: Record<string, string> = {};
    if (verdict && ['FAKE', 'REAL', 'INCONCLUSIVE'].includes(verdict.toUpperCase())) {
      filter.overallVerdict = verdict.toUpperCase();
    }

    // Get total count for pagination info
    const totalCount = await AnalysisLog.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated results
    const analysisLogs = await AnalysisLog.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .select('-__v') // Exclude version field
      .lean(); // Return plain objects instead of mongoose documents

    // Calculate pagination metadata
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        analyses: analysisLogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        }
      }
    });

  } catch (error) {
    console.error("Error fetching analysis history:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch analysis history" },
      { status: 500 }
    );
  }
}

// Health check endpoint for the history API
export async function HEAD() {
  try {
    await connectToDatabase();
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}