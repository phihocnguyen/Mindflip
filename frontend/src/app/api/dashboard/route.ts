import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

// GET /api/dashboard - Lấy dữ liệu dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const response = await apiHelper.get(`/dashboard?userId=${userId}`);
    
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