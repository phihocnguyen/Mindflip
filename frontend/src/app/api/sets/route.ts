import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

// GET /api/sets - Lấy danh sách sets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const response = await apiHelper.get(`/sets?userId=${userId}&page=${page}&limit=${limit}`);
    
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

// POST /api/sets - Tạo set mới
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization') ?? '';
    const headers = token ? { Authorization: token } : undefined;
    console.log(headers);
    const body = await request.json();
    const response = await apiHelper.post('/api/sets', body, {
      headers: headers
    });
    
    if (response.success) {
      return NextResponse.json(response.data, { status: 201 });
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
