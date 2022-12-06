const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authMiddleware = (permissions = []) => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: "Access denied!",
                error: "Please log in first",
            });
        }
        try {
            const decoded = jwt.verify(
                req.headers.authorization.replace("Bearer ", ""),
                process.env.JTW_SECRET_KEY
            );

            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
            });

            if (permissions.length) {
                if (!permissions.includes(decoded.role)) {
                    return res.status(401).json({
                        status: "You don't have permission 1",
                        error: "Access Denied",
                    });
                }
            }

            req.userId = user.id;
            req.role = decoded.role;
        } catch (error) {
            return res.json({
                status: "error",
                error: "Invalid jwt token",
            });
        }
        next();
    };
};

module.exports = authMiddleware;
