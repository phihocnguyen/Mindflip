import { NextRequest, NextResponse } from 'next/server';
import { apiHelper } from '~/libs/api';

// GET /api/sets/[id] - Lấy thông tin set cụ thể
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const id = pathname.split('/').pop(); // Lấy ID từ đường dẫn URL

  const token = request.headers.get('authorization') ?? '';
  const headerObject = token ? { Authorization: token } : undefined;

  try {
    console.log(id, headerObject);
    const response = await apiHelper.get(`/api/sets/${id}`, {
      headers: headerObject,
    });

    if (response.success) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ error: response.error }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// PUT /api/sets/[id] - Cập nhật set
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve the params promise
    const resolvedParams = await params;
    const token = request.headers.get('authorization') ?? '';
    const headers = token ? { Authorization: token } : undefined;

    const body = await request.json();

    const response = await apiHelper.patch(`/sets/${resolvedParams.id}`, body, {
      headers: headers,
    });

    if (response.success) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ error: response.error }, { status: 400 });
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve the params promise
    const resolvedParams = await params;
    const token = request.headers.get('authorization') ?? '';
    const headers = token ? { Authorization: token } : undefined;

    const response = await apiHelper.delete(`/sets/${resolvedParams.id}`, {
      headers: headers,
    });

    if (response.success) {
      return NextResponse.json({ message: 'Set deleted successfully' });
    } else {
      return NextResponse.json({ error: response.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}