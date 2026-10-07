import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { getPlansForUser, savePlanForUser, deletePlanForUser, SavedPlanRecord } from '@/lib/db';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('masa5_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekmektedir.' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Oturum süresi dolmuş.' }, { status: 401 });
    }

    const plans = await getPlansForUser(payload.userId);
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json({ error: 'Planlar yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('masa5_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Plan kaydetmek için lütfen giriş yapınız.' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Oturum süresi dolmuş.' }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || !plan.lessonName) {
      return NextResponse.json({ error: 'Geçersiz ders planı verisi.' }, { status: 400 });
    }

    const newRecord: SavedPlanRecord = {
      id: crypto.randomUUID(),
      userId: payload.userId,
      title: plan.lessonName,
      subject: plan.subjectTopic || 'Genel Konu',
      grade: plan.gradeLevel || 'Belirtilmedi',
      planJson: plan,
      createdAt: new Date().toISOString(),
    };

    await savePlanForUser(newRecord);
    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    console.error('Save plan error:', error);
    return NextResponse.json({ error: 'Plan kaydedilirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('masa5_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekmektedir.' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Oturum süresi dolmuş.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('id');

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID gereklidir.' }, { status: 400 });
    }

    await deletePlanForUser(payload.userId, planId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ error: 'Plan silinirken bir hata oluştu.' }, { status: 500 });
  }
}
