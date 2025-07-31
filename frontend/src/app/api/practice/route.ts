import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

// GET /api/practice - Lấy dữ liệu practice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const setId = searchParams.get('setId');
    const mode = searchParams.get('mode') || 'flashcard'; // flashcard, quiz, etc.

    const response = await apiHelper.get(`/practice?userId=${userId}&setId=${setId}&mode=${mode}`);
    
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

// POST /api/practice - Lưu kết quả practice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await apiHelper.post('/practice', body);
    
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