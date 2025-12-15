
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    // Authenticate user first
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const logs = await prisma.staffloginlog.findMany({
            where: { StaffID: user.staffId },
            orderBy: { LoginTime: 'desc' },
            take: 10
        });

        return NextResponse.json(logs, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
