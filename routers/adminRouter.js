const express = require("express");
const {
    products
} = require("../models");
const { checkAuthAdmin } = require("../utils");
const adminRouter = express.Router();
const multer = require("multer");
const fs = require("fs");
const { uploadFile, s3 } = require("../s3");
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(null,String(Date.now()) +"-"+ file.originalname); 
    }
})
const upload = multer({
    storage: storage,
})

adminRouter.get("/",checkAuthAdmin, (req, res, next) => {
    res.render("admin");
})

adminRouter.post("/",upload.single("image"), async (req, res, next) => {
    const file = req.file;
    console.log(file);
    const result = await uploadFile(file);
    console.log(result);
    await fs.unlink("./uploads/" + req.file.filename, (err) => {
        if (err) {
            throw err;
        }
    })
    // products.create({

    // })
})

module.exports = adminRouter;