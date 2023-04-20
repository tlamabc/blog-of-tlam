const express = require("express");
const userModel = require("../models/user");
const app = express();

app.get("/", (req, res) => {
  res.render("users/addOrEdit.hbs", {
    viewTitle: " THÊM THÀNH VIÊN",
  });
});

//add and update data
app.post("/add", async (req, res) => {
  console.log(req.body);
  if (req.body.id == "") {
    //add
    addRecord(req, res);
  } else {
    //update
    updateRecord(req, res);
  }
});

function addRecord(req, res) {
  const u = new userModel(req.body);
  try {
    u.save();
    res.render("users/addOrEdit.hbs", {
      viewTitle: " THÊM THÀNH VIÊN THÀNH CÔNG",
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

function updateRecord(req, res) {
  userModel
    .findByIdAndUpdate(req.body.id, req.body, { new: true })
    .then((doc) => {
      res.redirect("/user/list");
    })
    .catch((err) => {
      console.log(err);
      res.render("users/addOrEdit.hbs", {
        viewTitle: "LỖI CẬP NHẬT",
      });
    });
}

//function updateRecord(req, res){
//    userModel.findByIdAndUpdate({_id:req.body.id}, req.body, {new:true},(err, doc)=>{
//        if(!err){
//            res.redirect('/user/list');
//
//        }else{
//            console.log(err);
//            res.render('users/addOrEdit.hbs',{
//            viewTitle:"ERROR UPDATE"
//            });
//        }
//    });
//}

//app.get('/list', (req, res) => {
//    res.render('users/view-users.hbs',{
//        viewTitle:"List User"
//    });
//});

app.get("/list", (req, res) => {
  userModel.find({}).then((users) => {
    res.render("users/view-users.hbs", {
      users: users.map((user) => user.toJSON()),
    });
  });
});

//edit
app.get("/edit/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).lean();
    res.render("users/addOrEdit.hbs", { user });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//delete
app.get("/delete/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id, req.body);
    if (!user) res.status(404).send("No item found");
    else {
      res.redirect("/user/list");
    }
    //res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

//đăng nhập
app.post("/passport", (req, res) => {
  // Lấy username và password từ request
  const { username, password } = req.body;

  // Tìm kiếm người dùng với username và password tương ứng
  userModel
    .findOne({ username, password })
    .then((user) => {
      if (!user) {
        console.log("Thông tin đăng nhập không hợp lệ");
        res.render("layouts/error.hbs");
      } else {
        console.log(`Đăng nhập thành công với thông tin: ${user}`);
        res.render("layouts/home.hbs");
      }
    })
    .catch((err) => {
      console.error("Đã xảy ra lỗi khi đăng nhập", err);
      res.status(500).send("Đăng nhập thất bại");
    });
});

app.get("/home", (req, res) => {
  res.render("layouts/home.hbs");
});
app.get("/product", (req, res) => {
  res.render("layouts/product.hbs");
});

module.exports = app;
