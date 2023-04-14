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
            id: product.id,
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

productsRouter.get("/item",async (req, res, next) => {
    try{
        const product = await products.findOne({where: {id: req.query.id}});
        let info, size = {
            S: 0,
            M: 0,
            L: 0,
            XL: 0,
            XXL: 0,
        }
        if (product) {
            info = {
                name: product.name,
                description: product.description,
                price: product.price,
                id: product.id,
            }
        }
        const itemsList = await items.findAll({where: {products_id: req.query.id}});
        if (itemsList) {
            for (let item of itemsList) {
                switch(item.size) {
                    case 'S': size.S++; break;
                    case 'M': size.M++; break;
                    case 'L': size.L++; break;
                    case 'XL': size.XL++; break;
                    case 'XXL': size.XXL++; break;
                }
            }
        } else {
            itemList = null;
        }
        res.render("item", {data: {
            info: info,
            size: size,
            quantity: req.query.quantity || null,
            success: req.query.success || null,
            size: req.query.size || null,
        }})
    
    } catch(e) {
        if (e) {
            console.log(e);
            return res.send("not ok")
        }
    }

})

productsRouter.post("/item", checkAuth, async (req, res, next) => {

    const id = req.body.id;
    const quantity = req.body.quantity;
    const size = req.body.size;
    const itemsFound = await items.findAll({where: {
        products_id: id,
        size: size,
    }})

    if (itemsFound.length >= quantity) {
        for (let i = 0; i<= quantity-1; i++) {
            await items_users.create({
                items_id: itemsFound[i].id,
                users_id: req.user.id,
            })
        }
        res.redirect(`/products/item?id=${id}&success=1`);
    } else {
        res.redirect(`/products/item?id=${id}&success=0&quantity=${itemsFound.length}&size=${size}`);
    }

})

module.exports = productsRouter;