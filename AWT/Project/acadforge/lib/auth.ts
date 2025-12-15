import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || 'default-secret-for-dev';

export async function setAuthCookie(payload: { staffId: number; email: string; name?: string }) {
    const token = jwt.sign(payload, SECRET, { expiresIn: '1d' });

    (await cookies()).set('acadforge_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24
    });
}

export async function getAuthUser(): Promise<{ staffId: number; email: string; name?: string; role?: string } | null> {
    const token = (await cookies()).get('acadforge_token')?.value;

    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, SECRET) as { staffId: number; email: string; name?: string; role?: string };
    } catch {
        return null;
    }
}