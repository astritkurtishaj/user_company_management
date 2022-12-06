const { findCompanyById, registerCompany } = require("./companyService");
const { findRoleById } = require("./roleService");
const { getUsers, updateUser, destroyUser } = require("./userService");

module.exports = {
    findCompanyById,
    findRoleById,
    getUsers,
    updateUser,
    destroyUser,
    registerCompany,
};
