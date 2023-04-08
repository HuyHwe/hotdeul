const express = require('express');
const {users} = require('../models');
const accountRounter =  express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("../passport");
initializePassport(passport);

accountRounter.get("/", (req,res, next) => {
    
})

accountRounter.get("/signup", (req, res, next) => {
    res.render("signup");
})

accountRounter.post("/signup",async (req, res, next) => {
    const email = req.body.email[1];
    const name = req.body.name;
    const phone = req.body.phone;
    // salt = bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, 10);
    users.create({name, email, phone, password});
    res.render("login", {data:{success: true}})
})

accountRounter.get("/login", (req,res, next) => {
    res.render("login");
})

accountRounter.post("/login", passport.authenticate("local", {successRedirect: "/account/login", failureRedirect:"/account/signup"}), (req, res, next) => {
    res.send("ok");
})

module.exports = accountRounter;