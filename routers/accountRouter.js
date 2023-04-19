const express = require('express');
const {
    users,
    orders,
    products,
} = require('../models');
const accountRounter =  express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("../passport");
initializePassport(passport);
const {checkAuth} = require("../utils");

accountRounter.get("/", checkAuth, (req,res, next) => {
    let missing = req.query.missing || null;
    let success = null;
    if (req.query.success === 'true') {
        success = true;
    } else if (req.query.success == 'false') {
        success = false;
    } 
    res.render("account", {data: {
        success,
        isAuthenticated: true,
        missing,
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
            return res.redirect("/account?success=false");
        }
    }

    res.redirect("/account?success=true");
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

accountRounter.get("/orders", checkAuth,async (req, res, next) => {
    const ordersListRaw = await orders.findAll({where: {users_id: req.user.id}});
    ordersList = []
    
    for (let order of ordersListRaw) {
        let totalPrice = 0;
        let productsInfoList = [];
        for (let i = 0; i<order.products_id.length; i++) {
            await products.findOne({where: {id: order.products_id[i]}}).then( res => {
                let info = {
                    name: res.name,
                    description: res.description,
                    price: res.price,
                    images: res.images,
                    size: order.items_size[i],
                }
                totalPrice+= res.price,
                productsInfoList.push(info);
            })
        }
        ordersList.unshift({productsInfoList, totalPrice, name: order.name, address: order.address, phone: order.phone});
    }

    if (req.query.ordered == 'true') {
        res.render("orders", {data: {
            ordered: true,
            ordersList,
            isAuthenticated: true,
        }})
    }else {
        res.render("orders", {data: {
            ordersList,
            isAuthenticated: true,
        }})
    }
})





module.exports = accountRounter;