const express = require("express");
const { Op } = require("sequelize");
const { items_users, items, products, orders } = require("../models");

const { checkAuth, checkAuthPost } = require("../utils");

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
    const firstProductId = (await products.findOne()).id;
    let pageNum = 1;
    if (typeof req.query.page != "undefined") {
        pageNum = Number(req.query.page);
    }
    const productsListRaw = await products.findAll({
        where: {
            id: {
                [Op.between]: [
                    firstProductId + (pageNum - 1) * 10,
                    pageNum * 10 + firstProductId,
                ],
            },
        },
    });
    let productsList = [];

    for (let product of productsListRaw) {
        productsList.push({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.images[0],
            id: product.id,
            images: product.images
        });
    }

    if (req.isAuthenticated()) {
        res.render("products", {
            data: { isAuthenticated: true, productsList },
        });
    } else {
        res.render("products", {
            data: { isAuthenticated: false, productsList },
        });
    }
});

productsRouter.get("/cart", checkAuth, async (req, res, next) => {
    let totalPrice = 0;
    let itemsList = [];
    let cart = await items_users.findAll({
        where: { users_id: req.user.id },
    });
    for (product of cart) {
        let price, description, name;
        item = await items.findOne({
            where: {
                products_id: product.products_id,
                size: product.items_size,
            },
        });
        if (item != null) {
            await products
                .findOne({ where: { id: item.products_id } })
                .then((res) => {
                    price = res.price;
                    totalPrice += price;
                    description = res.description;
                    name = res.name;
                });

            itemsList.push({
                name,
                description,
                items_size: product.items_size,
                price,
                products_id: product.products_id,
            });
        }
    }

    res.render("cart", {
        data: { itemsList, isAuthenticated: true, totalPrice },
    });
});

productsRouter.post("/cart", async (req, res, next) => {
    if (!req.user) {
        return res.redirect("/account/login");
    }

    if (req.body.productDelete) {
        const itemsList = await items_users.findAll({
            where: {
                products_id: req.body.productDelete,
                items_size: req.body.sizeDelete,
            },
        });
        await items_users.destroy({ where: { id: itemsList[0].id } });
        res.redirect("/products/cart");
    } else if (req.body.order) {
        if (req.user.address == null) {
            return res.redirect("/account?missing=address");
        }
        if (req.user.phone == null) {
            return res.redirect("/account?missing=phone");
        }
        const phone = req.user.phone;

        itemsListId = [];
        productsListId = [];
        itemsSizeId = [];
        try {
            const productsList = await items_users.findAll({
                where: { users_id: req.user.id },
            });
            if (productsList == null || productsList.length == 0) {
                return res.redirect("/products/cart");
            }

            for (product of productsList) {
                await items
                    .findOne({
                        where: {
                            products_id: product.products_id,
                            size: product.items_size,
                        },
                    })
                    .then((res) => {
                        itemsListId.push(res.id);
                        productsListId.push(product.products_id);
                        itemsSizeId.push(product.items_size);
                    });
            }
            await items.destroy({ where: { id: item.id } });
            await orders.create({
                users_id: req.user.id,
                items_id: itemsListId,
                products_id: productsListId,
                items_size: itemsSizeId,
                name: req.user.name,
                address: req.user.address,
                phone,
            });
            await items_users.destroy({
                where: { users_id: req.user.id },
            });
            res.redirect("/account/orders?ordered=true");
        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    }
});

productsRouter.get("/item", async (req, res, next) => {
    try {
        const product = await products.findOne({
            where: { id: req.query.id },
        });
        let info,
            size = {
                S: 0,
                M: 0,
                L: 0,
                XL: 0,
                XXL: 0,
            };
        if (product) {
            info = {
                name: product.name,
                description: product.description,
                price: product.price,
                images: product.images,
                id: product.id,
            };
        }
        const itemsList = await items.findAll({
            where: { products_id: req.query.id },
        });
        if (itemsList) {
            for (let item of itemsList) {
                switch (item.size) {
                    case "S":
                        size.S++;
                        break;
                    case "M":
                        size.M++;
                        break;
                    case "L":
                        size.L++;
                        break;
                    case "XL":
                        size.XL++;
                        break;
                    case "XXL":
                        size.XXL++;
                        break;
                }
            }
        } else {
            itemsList = null;
        }
        res.render("item", {
            data: {
                isAuthenticated: req.user != null ? true : false,
                info: info,
                size: size,
                quantity: req.query.quantity || null,
                success: req.query.success || null,
                size: req.query.size || null,
            },
        });
    } catch (e) {
        if (e) {
            console.log(e);
            return res.send("not ok");
        }
    }
});

productsRouter.post("/item", checkAuth, async (req, res, next) => {
    const id = req.body.id;
    const quantity = req.body.quantity;
    const size = req.body.size;
    const itemsFound = await items.findAll({
        where: {
            products_id: id,
            size: size,
        },
    });

    if (itemsFound.length >= quantity) {
        for (let i = 0; i <= quantity - 1; i++) {
            await items_users.create({
                products_id: id,
                items_size: size,
                users_id: req.user.id,
            });
        }
        res.redirect(`/products/item?id=${id}&success=1`);
    } else {
        res.redirect(
            `/products/item?id=${id}&success=0&quantity=${itemsFound.length}&size=${size}`
        );
    }
});

module.exports = productsRouter;
