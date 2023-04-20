const express = require("express");
const productModel = require("../models/product");
const app = express();


// Render form for adding a new product
app.get("/", (req, res) => {
  res.render("users/addOrEditProduct.hbs", {
    viewTitle: "THÊM SẢN PHẨM",
  });
});

// Add new product or update existing product
app.post("/add", async (req, res) => {
  if (req.body.id == "") {
    // Add new product
    addProduct(req, res);
  } else {
    // Update existing product
    updateProduct(req, res);
  }
});

// Function to add a new product
async function addProduct(req, res) {
  const p = new productModel(req.body);
  try {
    await p.save();
    res.render("users/addOrEditProduct.hbs", {
      viewTitle: "THÊM SẢN PHẨM THÀNH CÔNG",
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

// Function to update an existing product
async function updateProduct(req, res) {
  productModel
    .findByIdAndUpdate(req.body.id, req.body, { new: true })
    .then((doc) => {
      res.redirect("/product/list");
    })
    .catch((err) => {
      console.log(err);
      res.render("users/addOrEditProduct.hbs", {
        viewTitle: "LỖI CẬP NHẬT SẢN PHẨM",
      });
    });
}

// Render list of all products
app.get("/list", (req, res) => {
  productModel.find({}).then((products) => {
    res.render("users/view-products.hbs", {
      products: products.map((product) => product.toJSON()),
    });
  });
});



// Render form for editing an existing product
app.get("/edit/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).lean();
    res.render("users/addOrEditProduct.hbs", { product });
  } catch (err) {
    console.log(err);
    res.redirect("/product/list");
  }
});

// Delete an existing product
app.get("/delete/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(
      req.params.id,
      req.body
    );
    if (!product) res.status(404).send("Không tìm thấy sản phẩm");
    else {
      res.redirect("/product/list");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});



//upload img
const path = require("path");
const multer = require("multer");
// Cấu hình Multer để lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/images"); // Thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Giữ nguyên tên file
  },
});

// Cấu hình Multer để chỉ chấp nhận file ảnh và dung lượng file tối đa là 1MB
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Chỉ cho phép tải lên file ảnh"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

// Hiển thị form tải lên
app.get("/upload", (req, res) => {
  res.render("upload.hbs");
});

// Xử lý tải lên file
app.post("product/upload", upload.single("avatar"), (req, res) => {
  // Kiểm tra nếu không có file được tải lên
  if (!req.file) {
    return res.send("Bạn chưa chọn file để tải lên");
  }

  // Trả về thông tin của file vừa tải lên
  res.send({
    filename: req.file.filename,
    size: req.file.size,
  });
});

module.exports = app;
