// import library and stuff
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const accountRounter = require("./routers/accountRouter");
const productsRouter = require("./routers/productsRouter");
const sequelize = require("./models").sequelize;
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const initializePassport = require("./passport");
dotenv.config();

// configuration process
const app = express();
const PORT = process.env.PORT || 5678;
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 60*60*60*24,
        secure: true,
    }
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);
//load static file
app.use("/assets", express.static(__dirname + '/assets'));
accountRounter.use("/assets", express.static(__dirname + '/assets'));


app.set('view engine', 'ejs');
// routing logic

app.get("/", (req, res, next) => {
    res.render("index");
});



app.use("/products", productsRouter);

app.use("/account", accountRounter);

sequelize.authenticate().then(() => {
    app.listen(PORT, () => {
        console.log("listening to port: " + PORT);
    })    
})


