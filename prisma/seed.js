const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
async function main() {
    const baseCompany = await prisma.company.upsert({
        where: { id: 1 },
        update: {},
        create: {
            companyName: "Base Company",
            isBaseCompany: true,
        },
    });

    // const createMany = await prisma.role.upsert({
    //     where: {
    //         role: "admin",
    //     },
    //     update: {},
    //     data: [{ role: "admin" }, { role: "manager" }, { role: "owner" }],
    // });

    const adminRole = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: {
            role: "admin",
        },
    });

    const managerRole = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: {
            role: "manager",
        },
    });

    const ownerRole = await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: {
            role: "owner",
        },
    });

    // const adminRole = await prisma.role.findUnique({
    //     where: {
    //         id: 1,
    //     },
    // });

    const hashedPassword = await bcrypt.hash("passowrd", 10);

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@admin.com" },
        update: {},
        create: {
            email: "admin@admin.com",
            password: hashedPassword,
            fullName: "Admin User",
            roleId: adminRole.id,
            companyId: baseCompany.id,
        },
    });

    console.log({ adminUser, baseCompany, adminRole });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
