const { registerCompanySchema } = require("./../validators/index");
const { PrismaClient } = require("@prisma/client");
const e = require("../errorHandler/errorHandler");
const roles = require("../enums/roles-enum");
const { getUsers, updateUser, destroyUser } = require("./../services/index");

const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    return await getUsers(req, res);
};

const update = async (req, res) => {
    return await updateUser(req, res);
};

const deleteUser = async (req, res) => {
    return await destroyUser(req, res);
};

module.exports = {
    getAllUsers,
    update,
    deleteUser,
};
