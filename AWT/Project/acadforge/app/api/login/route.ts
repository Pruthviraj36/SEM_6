import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';

const SECRET = process.env.JWT_SECRET || 'default-secret-for-dev';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password required' },
        { status: 400 },
      );
    }

    if (!SECRET) {
      console.warn('Using default JWT secret for development. Set JWT_SECRET environment variable for production.');
    }

    const staff = await prisma.staff.findUnique({
      where: { Email: email },
      select: { StaffID: true, Email: true, Password: true, StaffName: true, Role: true },
    });

    if (!staff) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const ip = (req as any).ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const ok = await bcrypt.compare(password, Buffer.from(staff.Password).toString('utf-8'));

    if (!ok) {
      await prisma.staffloginlog.create({
        data: {
          StaffID: staff.StaffID,
          IPAddress: ip.split(',')[0].trim().substring(0, 45), // Take first IP if list, limit length
          UserAgent: userAgent.substring(0, 255),
          Success: false,
          LoginTime: new Date()
        }
      });

      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Prepare token
    const token = jwt.sign(
      { staffId: staff.StaffID, email: staff.Email, name: staff.StaffName, role: staff.Role },
      SECRET,
      { expiresIn: '1d' }
    );

    // Record successful login
    await prisma.staffloginlog.create({
      data: {
        StaffID: staff.StaffID,
        IPAddress: ip.split(',')[0].trim().substring(0, 45),
        UserAgent: userAgent.substring(0, 255),
        Success: true,
        LoginTime: new Date()
      }
    });

    const res = NextResponse.json({ message: 'Logged in' }, { status: 200 });

    res.cookies.set('acadforge_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 },
    );
  }
}
