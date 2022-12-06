const Joi = require("joi");

const updateUserSchema = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().lowercase().optional(),
    password: Joi.string().min(2).optional(),
    roleId: Joi.number().optional(),
    companyId: Joi.number().optional(),
});

module.exports = {
    updateUserSchema,
};
