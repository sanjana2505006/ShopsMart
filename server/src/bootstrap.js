const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

const demoUsers = [
    {
        name: 'Riya Sharma',
        email: 'riya@college.edu',
        password: 'smartshop123',
        role: 'student',
    },
    {
        name: 'Mess Admin',
        email: 'admin.mess@college.edu',
        password: 'committee123',
        role: 'admin',
    },
];

async function ensureDatabase() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "passwordHash" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'student',
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `);

    for (const demoUser of demoUsers) {
        const existingUser = await prisma.user.findUnique({
            where: { email: demoUser.email },
        });

        if (!existingUser) {
            const passwordHash = await bcrypt.hash(demoUser.password, 10);

            await prisma.user.create({
                data: {
                    name: demoUser.name,
                    email: demoUser.email,
                    passwordHash,
                    role: demoUser.role,
                },
            });
        }
    }
}

if (require.main === module) {
    ensureDatabase()
        .then(async () => {
            console.log('SmartShop database is ready.');
            await prisma.$disconnect();
        })
        .catch(async (error) => {
            console.error('Failed to initialize database:', error);
            await prisma.$disconnect();
            process.exit(1);
        });
}

module.exports = {
    ensureDatabase,
};
