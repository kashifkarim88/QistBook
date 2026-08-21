"use server";

import { prisma } from "@/lib/prisma";
import { createSession, logoutSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { error: "Please provide both username and password." };
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return { error: "Invalid username or password." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return { error: "Invalid username or password." };
    }

    await createSession(user.username);
    redirect("/dashboard");
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const recoveryKey = formData.get("recoveryKey") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!username || !recoveryKey || !newPassword) {
        return { error: "All fields are required for password reset." };
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return { error: "Invalid admin username." };
    }

    const isKeyValid = await bcrypt.compare(recoveryKey, user.recoveryKeyHash);
    if (!isKeyValid) {
        return { error: "Incorrect Secret Recovery Key." };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
    });

    return { success: "Password updated successfully. You can now log in." };
}

export async function logoutAction() {
    await logoutSession();
    redirect("/login");
}