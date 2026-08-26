import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-key-change-this"
);

export async function createSession(username: string) {
    const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set("qistbook_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
}

export async function verifySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("qistbook_session")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch {
        return null;
    }
}

export async function logoutSession() {
    const cookieStore = await cookies();
    cookieStore.delete("qistbook_session");
}