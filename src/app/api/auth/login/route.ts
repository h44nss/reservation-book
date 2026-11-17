import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Default fallback credentials if database admin_users is empty/not migrated yet
const DEFAULT_ADMIN = {
  id: 'admin-default',
  email: 'admin@pustakamodern.id',
  password: 'Admin123!',
  name: 'Petugas Utama Perpustakaan',
  role: 'superadmin',
};

const ALT_ADMIN = {
  id: 'admin-alt',
  email: 'petugas@pustakamodern.id',
  password: 'Admin123!',
  name: 'Petugas Loket Sirkulasi',
  role: 'admin',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let authenticatedUser: { id: string; email: string; name: string; role: string } | null = null;

    // 1. Fast check for built-in admin accounts first (instant response)
    if (cleanEmail === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      authenticatedUser = {
        id: DEFAULT_ADMIN.id,
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
      };
    } else if (cleanEmail === ALT_ADMIN.email && password === ALT_ADMIN.password) {
      authenticatedUser = {
        id: ALT_ADMIN.id,
        email: ALT_ADMIN.email,
        name: ALT_ADMIN.name,
        role: ALT_ADMIN.role,
      };
    }

    // 2. If not matched with default, check Supabase admin_users table (with 3-second timeout)
    if (!authenticatedUser) {
      try {
        const supabase = createServerClient();
        const queryPromise = supabase
          .from('admin_users')
          .select('id, email, password, name, role')
          .eq('email', cleanEmail)
          .single();

        const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (!error && data && data.password === password) {
          authenticatedUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          };
        }
      } catch {
        // Fallback or ignore timeout
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Email atau kata sandi tidak valid. Periksa kembali data Anda.' },
        { status: 401 }
      );
    }

    // Create session payload
    const sessionData = {
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
      loginAt: new Date().toISOString(),
    };

    const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // Create response with explicit Set-Cookie header AND NextResponse cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
      },
      token,
    });

    // Set cookie via NextResponse cookies API
    response.cookies.set('pustaka_admin_session', token, {
      httpOnly: false, // Allow client JS to read session verification if needed
      secure: false, // Ensure works on both http://localhost and https
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal memproses login.' }, { status: 500 });
  }
}
