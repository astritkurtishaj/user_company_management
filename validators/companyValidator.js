const Joi = require("joi");

const registerCompanySchema = Joi.object({
    companyName: Joi.string().required(),
    isBaseCompany: Joi.bool().required(),
});

const updateCompanySchema = Joi.object({
    companyName: Joi.string().required(),
    isBaseCompany: Joi.bool().optional(),
});

module.exports = {
    registerCompanySchema,
    updateCompanySchema,
};
