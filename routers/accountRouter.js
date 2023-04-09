const express = require('express');
const {users} = require('../models');
const accountRounter =  express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("../passport");
initializePassport(passport);
const {checkAuth} = require("../utils");

accountRounter.get("/", checkAuth, (req,res, next) => {
    res.render("account", {data: {name: req.user.name}});
})

accountRounter.get("/signup", (req, res, next) => {
    res.render("signup");
})

accountRounter.post("/signup",async (req, res, next) => {
    const email = req.body.email[1];
    const name = req.body.name;
    const phone = req.body.phone;
    let findUser;
    try {
        findUser = await users.findOne({where:{email}});
    } catch (e) {
        if (e) {
            res.render("signup", {data:{error: true}});
        }
    }
    if (findUser != null) {
        res.render("signup", {data: {emailExisted: true}});
    } else {
        const password = await bcrypt.hash(req.body.password, 10);
        await users.create({email, name, phone, password})
        res.render("login", {data:{success: true}})
    }

    
})

accountRounter.get("/login", (req,res, next) => {
    res.render("login");
})

accountRounter.get("/loginn", (req,res, next) => {
    res.render("login", {data: {wrongCredential: true}});
})

accountRounter.post("/login", passport.authenticate("local", {successRedirect: "/", failureRedirect:"/account/loginn"}), (req, res, next) => {
    
})

module.exports = accountRounter;