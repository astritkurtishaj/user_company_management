const { loginSchema } = require("./loginValidator");
const { registerSchema } = require("./signUpValidator");
const {
    registerCompanySchema,
    updateCompanySchema,
} = require("./companyValidator");
const { updateUserSchema } = require("./updateUserValidator");

module.exports = {
    loginSchema,
    registerSchema,
    registerCompanySchema,
    updateCompanySchema,
    updateUserSchema,
};
