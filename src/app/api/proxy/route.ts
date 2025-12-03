
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get('url');

  if (!videoUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const videoResponse = await fetch(videoUrl);

    if (!videoResponse.ok) {
      return new NextResponse('Failed to fetch video', { status: videoResponse.status });
    }

    const headers = new Headers(videoResponse.headers);
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(videoResponse.body, {
      status: videoResponse.status,
      statusText: videoResponse.statusText,
      headers,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ success: false, message: 'Server Error', error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
