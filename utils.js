const {users} = require("./models");

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/account/login");
}

function checkAuthPost(req) {
    if (req.isAuthenticated()) {
        return true;
    }
    return false;
}

async function checkAuthAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        const adminList = await users.findAll({where: {admin: 1}})
        for (admin of adminList) {
            if (req.user.id === admin.id) {
                return next();
            }
        }
        res.render("404");
    } else {
        res.render("404");
    }
}


module.exports = {
    checkAuth,
    checkAuthAdmin,
    checkAuthPost
};