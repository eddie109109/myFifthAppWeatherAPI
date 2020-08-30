// give credit to the following youtube channel that teaches me how to work with api and learned the MVC industry model
//https://www.youtube.com/watch?v=dDjzTDN3cy8

const express  = require("express");
const app = express();
const router = require("./router");
const path = require('path');

app.use(express.urlencoded({extended: false}));

app.use(express.json()); //convert anything to json

app.use(express.static("public")); // let express gain ascess to public folder so that you dont have to define the path manually

app.set("views","views");
// look for folder called views
// views are the files that you render in the web browsers
app.set("view engine", "hbs");
// get the tempplate engine hbs

app.use("/",router);

app.use(express.static(path.join(__dirname, 'public')));


var port = process.env.PORT || 3000;
app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
});
