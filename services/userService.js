const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const roles = require("../enums/roles-enum");
const { updateUserSchema } = require("../validators/index");
const e = require("../errorHandler/errorHandler");
const { findCompanyById } = require("./companyService");
const { findRoleById } = require("./roleService");
const updateUserOrRegister = require("./commonService");

const { isAdmin, isBaseCompanyAndUserAdmin } = require("./permissionService");

const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email: email,
        },
        include: {
            role: true,
        },
    });
};

const findUserById = async (userId) => {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            role: true,
            company: true,
        },
    });
};

const createUser = async (userData) => {
    return await prisma.user.create({
        data: {
            ...userData,
        },
    });
};

const updateUsr = async (userData, userId) => {
    return await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            ...userData,
        },
    });
};

const hashPassword = async (passowrd) => {
    return await bcrypt.hash(passowrd, 10);
};

const findUsersByCompanyId = async (companyId) => {
    return await prisma.user.findMany({
        where: {
            companyId: companyId,
        },
        include: {
            company: true,
            role: true,
        },
    });
};

const findAllUsers = async () => {
    return await prisma.user.findMany({
        include: {
            company: true,
            role: true,
        },
    });
};

const getUsers = async (req, res) => {
    try {
        const user = await findUserById(req.userId);

        if (req.role === roles.ADMIN) {
            const users = await findAllUsers();

            return res.status(200).json({
                users,
            });
        }

        const users = await findUsersByCompanyId(user.companyId);

        return res.status(200).json({
            users,
        });
    } catch (error) {
        e.handleError(res, error);
    }
};

const updateUser = async (req, res) => {
    // return await updateUserOrRegister(req, res, "update");
    try {
        // return res.json(req.body);
        const validatedBody = await updateUserSchema.validateAsync(req.body);
        const authUser = await findUserById(req.userId);
        const user = await findUserById(+req.params.id);

        if (!user) {
            return res.status(404).json({
                status: "error",
                error: "User with this id not found!",
            });
        }

        const company = await findCompanyById(validatedBody.companyId);

        if (!company) {
            return res.status(404).json({
                status: "error",
                error: "This is not a valid company",
            });
        }

        const role = await findRoleById(validatedBody.roleId);

        if (!role) {
            return res.status(404).json({
                status: "error",
                error: "This role is not valid",
            });
        }

        const hashedPassword = await hashPassword(validatedBody.password);
        validatedBody["password"] = hashedPassword;
        validatedBody["email"] = user.email;

        if (
            company.isBaseCompany &&
            role.role === roles.ADMIN &&
            authUser.role.role === roles.ADMIN
        ) {
            const updatedUser = await updateUsr(validatedBody, user.id);

            return res.status(201).json({
                messages: "User updated!",
                user: updatedUser,
            });
        }

        if (!company.isBaseCompany && role.role !== roles.ADMIN) {
            if (authUser.role.role === roles.ADMIN) {
                const updatedUser = await updateUsr(validatedBody, user.id);

                return res.status(201).json({
                    messages: "User updated!",
                    user: updatedUser,
                });
            }

            if (
                authUser.companyId !== validatedBody.companyId ||
                authUser.companyId !== user.companyId
            ) {
                return res.status(403).json({
                    messages:
                        "You must be assigned to same company and the companyId in request must be the same as auth user!",
                });
            }

            const updatedUser = await updateUsr(validatedBody, user.id);

            return res.status(201).json({
                messages: "User updated!",
                user: updatedUser,
            });
        }

        return res.status(422).json({
            messages: "Role type and company type don't match!",
        });

        // switch (authUser.role.role) {
        //     case roles.ADMIN: {
        //         if (
        //             company.isBaseCompany === true &&
        //             role.role === roles.ADMIN
        //         ) {
        //             const updatedUser = await updateUsr(validatedBody, user.id);

        //             return res.status(201).json({
        //                 messages: "User created!",
        //                 user: updatedUser,
        //             });
        //         } else if (
        //             !company.isBaseCompany === true &&
        //             !role.role === roles.ADMIN
        //         ) {
        //             const updatedUser = await updateUsr(validatedBody, user.id);

        //             return res.status(201).json({
        //                 messages: "User created!",
        //                 user: updatedUser,
        //             });
        //         } else {
        //             return res.status(422).json({
        //                 messages: "Role type and company type don't match!",
        //             });
        //         }
        //     }
        //     case roles.OWNER: {
        //         if (
        //             !company.isBaseCompany === true &&
        //             !role.role === roles.ADMIN &&
        //             authUser.companyId === validatedBody.companyId &&
        //             authUser.companyId === user.companyId
        //         ) {
        //             const updatedUser = await updateUsr(validatedBody, user.id);

        //             return res.status(201).json({
        //                 messages: "User created!",
        //                 user: updatedUser,
        //             });
        //         } else {
        //             return res.status(422).json({
        //                 messages: "Role type and company type don't match!",
        //             });
        //         }
        //     }
        //     default:
        //         return res.status(403).json({
        //             messages: "You can't update this user",
        //         });
        // }

        // if (isAdmin(authUser.role.role)) {
        //     if (company.isBaseCompany === true &&
        // role.role === roles.ADMIN) {
        //         const updatedUser = await updateUsr(validatedBody, user.id);

        //         return res.status(201).json({
        //             messages: "User updated!",
        //             user: updatedUser,
        //         });
        //     }

        //     if (!company.isBaseCompany === true &&
        // !role.role === roles.ADMIN) {
        //         const updatedUser = await updateUsr(validatedBody, user.id);

        //         return res.status(201).json({
        //             messages: "User updated!",
        //             user: updatedUser,
        //         });
        //     }

        //     return res.status(422).json({
        //         messages: "Role type and company type don't match!",
        //     });
        // } else if (!isAdmin(authUser.role.role)) {
        //     if (
        //         !company.isBaseCompany === true &&
        // !role.role === roles.ADMIN &&
        //         authUser.companyId === validatedBody.companyId &&
        //         authUser.companyId === user.companyId
        //     ) {
        //         const updatedUser = await updateUsr(validatedBody, user.id);

        //         return res.status(201).json({
        //             messages: "User updated!",
        //             user: updatedUser,
        //         });
        //     }
        //     return res.status(403).json({
        //         messages: "Something didn't match, try again!",
        //     });
        // } else {
        //     return res.status(403).json({
        //         messages: "You can't update this user 3",
        //     });
        // }

        // if (!isAdmin(authUser.role.role)) {
        //     if (
        //         !isBaseCompanyAndUserAdmin(company.isBaseCompany, role.role) &&
        //         authUser.companyId === validatedBody.companyId &&
        //         authUser.companyId === user.companyId
        //     ) {
        //         const updatedUser = await updateUsr(validatedBody, user.id);

        //         return res.status(201).json({
        //             messages: "User created!",
        //             user: updatedUser,
        //         });
        //     }
        //     return res.status(403).json({
        //         messages: "You can't update this user 2",
        //     });
        //     // if (authUser.companyId === user.companyId) {
        //     //     const updatedUser = await updateUsr(validatedBody, user.id);

        //     //     return res.status(201).json({
        //     //         messages: "User created!",
        //     //         user: updatedUser,
        //     //     });
        //     // }
        // }

        // return res.status(422).json({
        //     messages: "You can't update this user",
        // });
    } catch (error) {
        e.handleError(res, error);
    }
};

const destroyUser = async (req, res) => {
    try {
        const authUser = await findUserById(req.userId);
        const userToDelete = await findUserById(+req.params.id);

        if (!userToDelete) {
            return res.status(404).json({
                status: "error",
                error: "User with this id not found!",
            });
        }

        if (req.role === roles.ADMIN) {
            const deletedUser = await prisma.user.delete({
                where: {
                    id: +req.params.id,
                },
            });
            return res.status(200).json({
                messages: "User deleted!",
                user: deletedUser,
            });
        }

        // if (authUser.companyId === userToDelete.companyId) {
        //     const deletedUser = await prisma.user.delete({
        //         where: {
        //             id: +req.params.id,
        //         },
        //     });
        //     return res.status(200).json({
        //         messages: "User deleted!",
        //         user: deletedUser,
        //     });
        // }
        return res.status(403).json({
            status: "error",
            error: "Only admin users can delete other users!",
        });
    } catch (error) {
        e.handleError(res, error);
    }
};

module.exports = {
    getUsers,
    updateUser,
    destroyUser,
    findUserById,
    findUserByEmail,
    hashPassword,
    createUser,
};
