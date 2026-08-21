import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminUsername = 'admin';
    const rawPassword = 'auto@321';
    const rawRecoveryKey = 'KEY-1234567890';

    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const recoveryKeyHash = await bcrypt.hash(rawRecoveryKey, 10);

    const existingUser = await prisma.user.findUnique({
        where: { username: adminUsername },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                username: adminUsername,
                passwordHash,
                recoveryKeyHash,
            },
        });
        console.log('✅ Default admin user created successfully.');
    } else {
        console.log('⚠️ Admin user already exists. Skipping seed.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });