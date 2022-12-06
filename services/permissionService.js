const roles = require("../enums/roles-enum");

const isAdmin = (authUserRole) => {
    return authUserRole === roles.ADMIN;
};

const isBaseCompanyAndUserAdmin = (isBaseCompany, role) => {
    return isBaseCompany && role === roles.ADMIN;
};

module.exports = {
    isAdmin,
    isBaseCompanyAndUserAdmin,
};
