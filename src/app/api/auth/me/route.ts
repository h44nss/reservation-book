import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check cookie from request
  let sessionToken = request.cookies.get('pustaka_admin_session')?.value;

  // Also check Authorization header as fallback
  if (!sessionToken) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionToken = authHeader.substring(7);
    }
  }

  if (!sessionToken) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const jsonStr = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const user = JSON.parse(jsonStr);

    if (!user || !user.email) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
