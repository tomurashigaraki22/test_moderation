import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

/**
 * POST /api/upload - Upload a video for moderation and storage
 * Accepts multipart form data with 'video' field
 * Forwards to moderation detection service and returns results
 * 
 * Returns:
 * - 201: success with URLs and moderation summary
 * - 403: rejected with decision object
 * - 400: bad request (missing/invalid video)
 * - 500: detection service error
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const video = formData.get('video');

    if (!video || !(video instanceof File)) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate video file
    if (!video.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a video.' },
        { status: 400 }
      );
    }

    if (video.size === 0) {
      return NextResponse.json(
        { error: 'Video file is empty' },
        { status: 400 }
      );
    }

    // Forward video to detection service
    const detectionResult = await forwardToDetectionService(video);

    // Check if detection service returned an error
    if (!detectionResult.success) {
      return NextResponse.json(detectionResult.data, { status: detectionResult.status });
    }

    // Return detection result with appropriate status
    return NextResponse.json(detectionResult.data, { status: detectionResult.status });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}

/**
 * Forward video to the actual detection service
 * Service should be running on localhost:3000 (or configured endpoint)
 */
async function forwardToDetectionService(video) {
  try {
    const buffer = await video.arrayBuffer();
    const uploadFormData = new FormData();
    uploadFormData.append('video', new Blob([buffer], { type: video.type }), video.name);

    // Call the actual detection service
    const detectionServiceUrl = "https://storage.ripplebids.com/upload"
    
    const response = await fetch(detectionServiceUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    const data = await response.json();

    // Check if detection service rejected the content
    if (response.status === 403) {
      return {
        success: false,
        status: 403,
        data,
      };
    }

    // Success response
    if (response.ok) {
      return {
        success: true,
        status: 201,
        data,
      };
    }

    // Other errors
    return {
      success: false,
      status: response.status || 500,
      data,
    };
  } catch (error) {
    console.error('Detection service error:', error);
    return {
      success: false,
      status: 500,
      data: { error: 'Failed to reach detection service' },
    };
  }
}
