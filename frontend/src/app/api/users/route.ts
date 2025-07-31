import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

// GET /api/users - Lấy danh sách users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const response = await apiHelper.get(`/users?page=${page}&limit=${limit}`);
    
    if (response.success) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: response.error },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 