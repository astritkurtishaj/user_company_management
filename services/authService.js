const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const e = require("../errorHandler/errorHandler");
const roles = require("../enums/roles-enum");
const { findCompanyById, findRoleById } = require("./index");
const {
    findUserByEmail,
    findUserById,
    hashPassword,
    createUser,
} = require("./userService");
const { loginSchema, registerSchema } = require("../validators/index");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    // return await updateUserOrRegister(req, res, "create");

    try {
        const validatedBody = await registerSchema.validateAsync(req.body);
        const authUser = await findUserById(req.userId);
        const user = await findUserByEmail(validatedBody.email);

        if (user) {
            return res.status(422).json({
                status: "error",
                error: "This email is already registered!",
            });
        }
        const company = await findCompanyById(validatedBody.companyId);
        if (!company) {
            return res.status(422).json({
                status: "error",
                error: "This is not a valid company",
            });
        }

        const role = await findRoleById(validatedBody.roleId);
        if (!role) {
            return res.status(422).json({
                status: "error",
                error: "This role is not valid",
            });
        }

        const hashedPassword = await hashPassword(validatedBody.password);
        validatedBody["password"] = hashedPassword;
        // return res.json(roles.ADMIN);

        if (
            company.isBaseCompany &&
            role.role === roles.ADMIN &&
            authUser.role.role === roles.ADMIN
        ) {
            const createdUser = await createUser(validatedBody);
            return res.status(201).json({
                messages: "User created!",
                user: createdUser,
            });
        }

        if (!company.isBaseCompany && role.role !== roles.ADMIN) {
            if (authUser.role.role === roles.ADMIN) {
                const createdUser = await createUser(validatedBody);
                return res.status(201).json({
                    messages: "User created!",
                    user: createdUser,
                });
            }

            if (authUser.companyId !== validatedBody.companyId) {
                return res.status(422).json({
                    messages: "You can register new users only in your company",
                });
            }

            const createdUser = await createUser(validatedBody);
            return res.status(201).json({
                messages: "User created!",
                user: createdUser,
            });
        }

        return res.status(422).json({
            messages: "Role type and company type don't match!",
        });

        // if (authUser.role.role === roles.ADMIN) {
        //     if (company.isBaseCompany && role.role === roles.ADMIN) {
        //         const createdUser = await createUser(validatedBody);
        //         return res.status(201).json({
        //             messages: "User created!",
        //             user: createdUser,
        //         });
        //     }
        //     if (!company.isBaseCompany && role.role !== roles.ADMIN) {
        //         const createdUser = await createUser(validatedBody);
        //         return res.status(201).json({
        //             messages: "User created!",
        //             user: createdUser,
        //         });
        //     }
        //     return res.status(422).json({
        //         messages: "Role type and company type don't match!",
        //     });
        // }
        // if (authUser.role.role !== roles.ADMIN) {
        //     if (!company.isBaseCompany && role.role !== roles.ADMIN) {
        //         if (authUser.companyId !== validatedBody.companyId) {
        //             return res.status(422).json({
        //                 messages:
        //                     "You can register new users only in you company",
        //             });
        //         }
        //         const createdUser = await createUser(validatedBody);
        //         return res.status(201).json({
        //             messages: "User created!",
        //             user: createdUser,
        //         });
        //     }
        // }
        // return res.status(422).json({
        //     messages: "Role type and company type don't match!",
        // });
    } catch (error) {
        e.handleError(res, error);
    }
};

const loginUser = async (req, res) => {
    try {
        const validatedLoginBody = await loginSchema.validateAsync(req.body);

        const user = await findUserByEmail(validatedLoginBody.email);

        if (user) {
            const auth = bcrypt.compare(
                validatedLoginBody.password,
                user.password
            );

            if (auth) {
                const token = jwt.sign(
                    { id: user.id, role: user.role.role },
                    process.env.JTW_SECRET_KEY,
                    {
                        expiresIn: process.env.JWT_EXPIRES,
                    }
                );

                return res.status(200).json({
                    status: "success",
                    success: "User has been logged in successfully",
                    token: token,
                });
            } else {
                res.status(422).json({
                    messages: "Wrong credentials",
                });
            }
        } else {
            res.status(422).json({
                messages: "Wrong credentials",
            });
        }
    } catch (error) {
        e.handleError(res, error);
    }
};
module.exports = {
    registerUser,
    loginUser,
};
