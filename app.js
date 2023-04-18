// import library and stuff
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const accountRounter = require("./routers/accountRouter");
const productsRouter = require("./routers/productsRouter");
const adminRouter = require("./routers/adminRouter");
const sequelize = require("./models").sequelize;
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const initializePassport = require("./passport");
dotenv.config();

const {
    checkAuth
} = require("./utils");

const {
    upload,
    getFileStream,
} = require("./s3");

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
    }
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);
//load static file
app.use("/assets", express.static(__dirname + '/assets'));
accountRounter.use("/assets", express.static(__dirname + '/assets'));
productsRouter.use("/assets", express.static(__dirname + '/assets'));


app.set('view engine', 'ejs');
// routing logic

app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render("index", {data: {isAuthenticated: true}});
    } else {
        // console.log(req.isAuthenticated())
        // console.log(req.user);
        res.render("index", {data: {isAuthenticated: false}});
    }
});



app.use("/products", productsRouter);

app.use("/account", accountRounter);

app.use("/admin", adminRouter);

app.get("/img/:key", (req, res, next) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
})



app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
    return;
  });



sequelize.authenticate().then(() => {
    app.listen(PORT, () => {
        console.log("listening to port: " + PORT);
    })    
})


