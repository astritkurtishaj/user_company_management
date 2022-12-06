const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findRoleById = async (roleId) => {
    return prisma.role.findUnique({
        where: {
            id: roleId,
        },
    });
};

module.exports = {
    findRoleById,
};
