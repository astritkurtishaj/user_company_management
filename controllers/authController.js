const { registerUser, loginUser } = require("./../services/authService");

const register = async (req, res) => {
    return await registerUser(req, res);
};

const login = async (req, res) => {
    return await loginUser(req, res);
};

module.exports = {
    register,
    login,
};
