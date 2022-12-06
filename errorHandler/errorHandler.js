exports.handleError = (res = {}, err = {}) => {
    // Sends error to user
    res.status(500).json({
        errors: {
            messages: err.message,
        },
    });
    return;
};
