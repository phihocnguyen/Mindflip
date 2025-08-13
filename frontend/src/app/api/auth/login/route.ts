import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await apiHelper.post('/auth/', body);
    
    if (response.success) {
      return NextResponse.json(response.data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: response.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in login API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 