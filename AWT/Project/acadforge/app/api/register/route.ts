import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, phone, role } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: 'Name, email, and password are required' },
                { status: 400 },
            );
        }

        // Check if user already exists (Email or Phone)
        const whereConditions: any[] = [{ Email: email }];
        if (phone) {
            whereConditions.push({ Phone: phone });
        }

        const existingStaff = await prisma.staff.findFirst({
            where: {
                OR: whereConditions
            },
        });

        if (existingStaff) {
            const conflictField = existingStaff.Email === email ? 'email' : 'phone number';
            return NextResponse.json(
                { message: `User already exists with this ${conflictField}` },
                { status: 409 },
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordBuffer = Buffer.from(hashedPassword, 'utf-8');

        // Create new staff
        const newStaff = await prisma.staff.create({
            data: {
                StaffName: name,
                Email: email,
                Password: passwordBuffer,
                Phone: phone || null,
                Role: role || 'Staff', // Default role
                Created: new Date(),
                Modified: new Date()
            },
        });

        return NextResponse.json(
            { message: 'Registration successful', staffId: newStaff.StaffID },
            { status: 201 },
        );

    } catch (err) {
        console.error('Registration error:', err);
        return NextResponse.json(
            { message: 'Server error during registration' },
            { status: 500 },
        );
    }
}
