import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

// GET /api/sets/[id] - Lấy thông tin set cụ thể
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiHelper.get(`/sets/${params.id}`);
    
    if (response.success) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: response.error },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/sets/[id] - Cập nhật set
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const response = await apiHelper.put(`/sets/${params.id}`, body);
    
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

// DELETE /api/sets/[id] - Xóa set
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiHelper.delete(`/sets/${params.id}`);
    
    if (response.success) {
      return NextResponse.json({ message: 'Set deleted successfully' });
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