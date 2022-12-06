const authRoutes = require("./auth.route");
const companyRoutes = require("./company.route");
const userRoutes = require("./user.route");

module.exports = async (app) => {
    app.use("/", authRoutes);
    app.use("/company", companyRoutes);
    app.use("/users", userRoutes);
};
