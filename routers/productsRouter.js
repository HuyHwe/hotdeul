const express = require('express');
const {
    checkAuth
} = require("../utils");

const productsRouter =  express.Router();

productsRouter.get("/", (req,res, next) => {
    if (req.isAuthenticated()) {
        render("products", {data: {isAuthenticated: true}});
    } else {
        render("products");
    }
})

productsRouter.get("/cart",checkAuth, async (req, res, next) => {
    
    res.render("cart");
})

module.exports = productsRouter;