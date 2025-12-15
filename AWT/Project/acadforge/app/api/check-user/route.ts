import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email required' }, { status: 400 });
        }

        const user = await prisma.staff.findUnique({
            where: { Email: email },
        });

        if (user) {
            return NextResponse.json({ exists: true, name: user.StaffName }, { status: 200 });
        } else {
            return NextResponse.json({ exists: false }, { status: 404 });
        }

    } catch (err) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
