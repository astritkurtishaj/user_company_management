// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcrypt");
// const roles = require("../enums/roles-enum");
// const { updateUserSchema, registerSchema } = require("../validators/index");
// const e = require("../errorHandler/errorHandler");
// const { findCompanyById } = require("./companyService");
// const { findRoleById } = require("./roleService");

// const { isAdmin, isBaseCompanyAndUserAdmin } = require("./permissionService");

// const prisma = new PrismaClient();

// const updateUserOrRegister = async (req, res, actionFlag) => {
//     try {
//         // return res.json(req.body);
//         const validatedBody =
//             actionFlag === "update"
//                 ? await updateUserSchema.validateAsync(req.body)
//                 : await registerSchema.validateAsync(req.body);

//         const authUser = await findUserById(req.userId);

//         const user =
//             actionFlag === "update"
//                 ? await findUserById(+req.params.id)
//                 : await findUserByEmail(validatedBody.email);

//         if (actionFlag === "update") {
//             if (!user) {
//                 await errorResponse(res, 404, "User with this id not found!");
//             }
//         }

//         if (actionFlag === "create") {
//             if (user) {
//                 await errorResponse(
//                     res,
//                     422,
//                     "This email is already registered!"
//                 );
//             }
//         }

//         const company = await findCompanyById(validatedBody.companyId);

//         if (!company) {
//             await errorResponse(res, 404, "This is not a valid company");
//         }

//         const role = await findRoleById(validatedBody.roleId);

//         if (!role) {
//             await errorResponse(res, 404, "This role is not valid");
//         }

//         const hashedPassword = await hashPassword(validatedBody.password);
//         validatedBody["password"] = hashedPassword;
//         actionFlag === "update"
//             ? (validatedBody["email"] = user.email)
//             : (validatedBody["email"] = validatedBody.email);

//         switch (authUser.role.role) {
//             case roles.ADMIN: {
//                 if (
//                     isBaseCompanyAndUserAdmin(company.isBaseCompany, role.role)
//                 ) {
//                     const instance =
//                         actionFlag === "update"
//                             ? await updateUsr(validatedBody, user.id)
//                             : await createUser(validatedBody);

//                     await successResponse(res, 201, instance, actionFlag);
//                 } else if (
//                     !isBaseCompanyAndUserAdmin(company.isBaseCompany, role.role)
//                 ) {
//                     const instance =
//                         actionFlag === "update"
//                             ? await updateUsr(validatedBody, user.id)
//                             : await createUser(validatedBody);

//                     await successResponse(res, 201, instance, actionFlag);
//                 } else {
//                     return res.status(422).json({
//                         messages: "Role type and company type don't match!",
//                     });
//                 }
//             }
//             case roles.OWNER: {
//                 if (
//                     !isBaseCompanyAndUserAdmin(
//                         company.isBaseCompany,
//                         role.role
//                     ) &&
//                     authUser.companyId === validatedBody.companyId &&
//                     authUser.companyId === user.companyId
//                 ) {
//                     const instance =
//                         actionFlag === "update"
//                             ? await updateUsr(validatedBody, user.id)
//                             : await createUser(validatedBody);

//                     await successResponse(res, 201, instance, actionFlag);
//                 } else {
//                     return res.status(422).json({
//                         messages: "Role type and company type don't match!",
//                     });
//                 }
//             }
//             default:
//                 return res.status(403).json({
//                     messages: "You can't update this user",
//                 });
//         }
//     } catch (error) {
//         e.handleError(res, error);
//     }
// };

// const successResponse = async (res, statusCode, createdInstance, actionFlag) => {
//     return await res.status(statusCode).json({
//         messages: `User ${actionFlag === "update" ? "updated" : "created"}`,
//         user: createdInstance,
//     });
// };

// const errorResponse = async (res, statusCode, message) => {
//     return await res.status(statusCode).json({
//         status: "error",
//         error: message,
//     });
// };

// // const findUserByEmail = async (email) => {
// //     return prisma.user.findUnique({
// //         where: {
// //             email: email,
// //         },
// //         include: {
// //             role: true,
// //         },
// //     });
// // };

// // const findUserById = async (userId) => {
// //     return prisma.user.findUnique({
// //         where: {
// //             id: userId,
// //         },
// //         include: {
// //             role: true,
// //         },
// //     });
// // };

// // const createUser = async (userData) => {
// //     return await prisma.user.create({
// //         data: {
// //             ...userData,
// //         },
// //     });
// // };

// // const updateUsr = async (userData, userId) => {
// //     return await prisma.user.update({
// //         where: {
// //             id: userId,
// //         },
// //         data: {
// //             ...userData,
// //         },
// //     });
// // };

// // const hashPassword = async (passowrd) => {
// //     return await bcrypt.hash(passowrd, 10);
// // };

// module.exports = {
//     updateUserOrRegister,
//     findUserByEmail,
// };
