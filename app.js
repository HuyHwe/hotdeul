// import library and stuff
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const accountRounter = require("./routers/accountRouter");
const productsRouter = require("./routers/productsRouter");
dotenv.config();

// configuration process
const app = express();
const PORT = process.env.PORT || 5432;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/", express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// routing logic

app.get("/", (req, res, next) => {
    res.render("index");
});

app.use("/products", productsRouter);

app.use("/account", accountRounter);


app.listen(PORT, () => {
    console.log("listening to port: " + PORT);
})


