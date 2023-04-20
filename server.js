const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphdbs = require("express-handlebars");
const useController = require("./controller/useController");
const productController = require("./controller/productController");
const url =
  "mongodb+srv://dangthanhlam1312:1312@cluster0.tgicte3.mongodb.net/dbUserManager?retryWrites=true&w=majority";
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.engine(".hbs", exphdbs.engine({ extname: ".hbs", defaultLayout: false }));
app.set("views engine", ".hbs");
app.use(express.json());

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

//app.use(userRoutes);
app.use("/user", useController);
app.use("/product", productController);
app.get("/main", function (req, res) {
  //Gọi tên nó ra
  res.render("layouts/main.hbs");
});



app.listen(5000, () => {
  console.log("server is running");
});
