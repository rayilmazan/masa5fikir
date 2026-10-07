import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, UserRecord } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, branch } = await req.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Lütfen adınızı ve soyadınızı giriniz.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Lütfen geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Şifreniz en az 6 karakter olmalıdır.' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta adresi ile zaten bir hesap kayıtlıdır.' }, { status: 400 });
    }

    const newUser: UserRecord = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      branch: (branch || 'Genel').trim(),
      createdAt: new Date().toISOString(),
    };

    await createUser(newUser);

    const token = createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      branch: newUser.branch,
    });

    const response = NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        branch: newUser.branch,
      },
    });

    response.cookies.set('masa5_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Kayıt işlemi sırasında bir hata oluştu.' }, { status: 500 });
  }
}
