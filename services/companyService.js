const { PrismaClient } = require("@prisma/client");
const roles = require("../enums/roles-enum");
const {
    registerCompanySchema,
    updateCompanySchema,
} = require("./../validators/index");

const prisma = new PrismaClient();

const findCompanyById = async (companyId) => {
    return prisma.company.findUnique({
        where: {
            id: companyId,
        },
    });
};

const create = async (companyData) => {
    return await prisma.company.create({
        data: {
            ...companyData,
        },
    });
};

const registerCompany = async (req, res) => {
    try {
        const validatedData = await registerCompanySchema.validateAsync(
            req.body
        );

        const createdCompany = await create(validatedData);

        return res.status(201).json({
            messages: "Company created!",
            user: createdCompany,
        });
    } catch (error) {
        e.handleError(res, error);
    }
};

const update = async (companyId, companyData, user) => {
    if (user.role.role === roles.ADMIN) {
        return await prisma.company.update({
            where: {
                id: companyId,
            },
            data: {
                ...companyData,
            },
        });
    }

    return await prisma.company.update({
        where: {
            id: companyId,
        },
        data: {
            companyName: companyData.companyName,
        },
    });
};

const updateCompany = async (req, res) => {
    const validatedData = await updateCompanySchema.validateAsync(req.body);
    const companyId = +req.params.id;

    const user = await prisma.user.findUnique({
        where: {
            id: req.userId,
        },
        include: {
            role: true,
        },
    });

    const company = await findCompanyById(companyId);

    if (!company) {
        return res.status(404).json({
            status: "error",
            error: "company not found!",
        });
    }

    if (req.role !== roles.ADMIN) {
        if (
            companyId !== user.companyId ||
            validatedData.isBaseCompany === true
        )
            return res.status(403).json({
                status: "error",
                error: "You don't have the right to update this company!",
            });
    }

    const updatedCompany = await update(companyId, validatedData, user);

    return res.status(201).json({
        messages: "company updated!",
        company: updatedCompany,
    });
};

module.exports = {
    findCompanyById,
    registerCompany,
    updateCompany,
};
