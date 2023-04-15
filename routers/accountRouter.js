const express = require('express');
const {
    users,
} = require('../models');
const accountRounter =  express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("../passport");
initializePassport(passport);
const {checkAuth} = require("../utils");

accountRounter.get("/", checkAuth, (req,res, next) => {
    res.render("account", {data: {
        isAuthenticated: true,
        name: req.user.name,
        email: req.user.email,
        password: req.user.password,
        address: req.user.address,
        phone: req.user.phone
    }});
})

accountRounter.post("/", async (req, res, next) => {
    if (req.body.password != null) {
        const notChange = await bcrypt.compare(req.body.password, req.user.password);
        if (!notChange) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        } else {
            req.body.password = req.user.password;
        }
    } else {
        req.body.password = req.user.password;
    }
    try {
        await users.update({
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            password: req.body.password,
        }, {where: {id:req.user.id}});
    } catch(e) {
        if (e) {
            console.log(e);
            return res.render("account", {data: {success: false, name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                }});
        }
    }

    res.render("account", {data: {success: true,
        name: req.user.name,
        email: req.user.email,
        password: req.user.password,
        address: req.user.address,
        phone: req.user.phone}});
    
})

accountRounter.get("/signup", (req, res, next) => {
    res.render("signup");
})

accountRounter.post("/signup",async (req, res, next) => {
    const email = req.body.email;
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

accountRounter.get("/logout", (req, res, next) => {
    req.logout((e) => {
        if (e) {
            console.log(e);
            return res.redirect("/404");
        }
    });
    res.redirect("/");
})





module.exports = accountRounter;