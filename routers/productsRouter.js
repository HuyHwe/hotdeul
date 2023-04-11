const express = require('express');
const {
    items_users,
    items,
    products
} = require("../models");

const {
    checkAuth,
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
    let itemList = [];
    let cart = await items_users.findAll({where: {users_id: req.user.id}});
    cart = cart.map(item => item.items_id);
    // cart.forEach(id => {
    //     let productId;
    //     items.findOne({where: {id: id}}).then(res => {
    //         size = res.size;
    //         productId = res.products_id;
    //     }).then((res) => {
    //         products.findOne({where: {id: productId}}).then(res => {
    //             price = res.price;
    //             description = res.description;
    //             name = res.name;
    //         });
    //     })
    // });

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



    // for(let i = 0; i < size.length; i++) {
    //     itemList.push({
    //         name: name[i],
    //         description: description[i],
    //         price: price[i],
    //         size: size[i],
    //     });
    // }
    console.log(itemList);
    res.render("cart", {data: {itemList}});
})

module.exports = productsRouter;