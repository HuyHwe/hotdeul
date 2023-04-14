const express = require("express");
const { checkAuthAdmin } = require("../utils");
const adminRouter = express.Router();

adminRouter.get("/",checkAuthAdmin, (req, res, next) => {
    res.render("admin");
})

module.exports = adminRouter;