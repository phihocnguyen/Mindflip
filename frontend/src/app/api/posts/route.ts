import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs';

// GET /api/posts?category=...&page=...&limit=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const response = await apiHelper.get(`/posts?${searchParams.toString()}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching posts from backend' },
      { status: error.response?.status || 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await apiHelper.post('/posts', body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error creating post' },
      { status: error.response?.status || 500 }
    );
  }
}