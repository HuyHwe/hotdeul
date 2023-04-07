const express = require('express');
const {users} = require('../models');
const accountRounter =  express.Router();
const bcrypt = require("bcrypt");

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
    res.send("ok");
})

module.exports = accountRounter;