const { registerCompanySchema } = require("./../validators/index");
const { registerCompany } = require("./../services/index");
const { PrismaClient } = require("@prisma/client");
const e = require("../errorHandler/errorHandler");
const { updateCompany } = require("./../services/companyService");

const prisma = new PrismaClient();

const register = async (req, res) => {
    return await registerCompany(req, res);
};

const update = async (req, res) => {
    return await updateCompany(req, res);
};

module.exports = {
    register,
    update,
};
