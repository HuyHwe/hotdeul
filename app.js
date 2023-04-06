// import library and stuff
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// configuration process
const app = express();
const PORT = process.env.PORT || 5432;


app.listen(PORT, () => {
    console.log("listening to port: " + PORT);
})


