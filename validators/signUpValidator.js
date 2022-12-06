const Joi = require("joi");

const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    roleId: Joi.number().required(),
    companyId: Joi.number().required(),
});

module.exports = {
    registerSchema,
};
