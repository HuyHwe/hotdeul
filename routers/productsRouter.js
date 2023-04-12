const express = require('express');
const { Op } = require("sequelize");
const {
    items_users,
    items,
    products
} = require("../models");

const {
    checkAuth,
} = require("../utils");

const productsRouter =  express.Router();

productsRouter.get("/",async (req,res, next) => {
    const firstProductId = (await products.findOne()).id;
    let pageNum = 1;
    if (typeof req.query.page != "undefined") {
        pageNum = Number(req.query.page);
    }
    const productsListRaw = await products.findAll({where: {id: {[Op.between] : [firstProductId + (pageNum - 1) * 10,pageNum * 10 + firstProductId]}}});
    let productsList = [];

    for (let product of productsListRaw) {
        productsList.push({
            name: product.name,
            description: product.description,
            price: product.price,
        })
    }

    if (req.isAuthenticated()) {
        res.render("products", {data: {isAuthenticated: true,
                                        productsList,}});
    } else {
        res.render("products", {data: {productsList}});
    }
});


productsRouter.get("/cart",checkAuth, async (req, res, next) => {
    let itemList = [];
    let cart = await items_users.findAll({where: {users_id: req.user.id}});
    cart = cart.map(item => item.items_id);
    for (id of cart) {
        let size, productId, price, description, name;
        await items.findOne({where: {id: id}}).then(res => {
            size = res.size;
            productId = res.products_id;
        });

        await products.findOne({where: {id: productId}}).then(res => {
            price = res.price;
            description = res.description;
            name = res.name;
        });

        itemList.push({
            name,
            description,
            size,
            price,
        });
    }
    console.log(itemList);
    res.render("cart", {data: {itemList}});
})

module.exports = productsRouter;