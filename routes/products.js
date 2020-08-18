const express = require("express");
const route = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const newProduct = require("../models/products");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//Adding the product route
route.post("/addProduct", upload.single("productImages"), async (req, res) => {
  const { title, author, ISBN_number, review } = req.body;
  const newItem = new newProduct({
    _id: new mongoose.Types.ObjectId(),
    title,
    author,
    ISBN_number,
    productImages: req.file.path,
    review


  });
  newItem
    .save()
    .then(response => {
      res.status(200).send({
        message: "Successfully Added Product",
        success: true,
        response
      });
    })
    .catch(err => {
      res.status(503).send({
        message: "Error while adding to products",
        success: false,
        Error: err.message
      });
    });
});

//Get all the product route
route.get("/", async (req, res) => {
  const allProducts = await newProduct.find({});

  if (allProducts.length > 0) {
    res.status(200).send({
      message: "All products",
      success: true,
      data: allProducts
    });
  } else {
    res.send({
      message: "No product available"
    });
  }
});

//Deleting the product
route.delete("/deleteProduct", async (req, res) => {
  const { id } = req.body;
  newProduct
    .deleteOne({ _id: id })
    .then(respone => {
      res.status(200).send({
        message: "Successfully Deleted the product",
        success: true,
        data: respone
      });
    })
    .catch(err => {
      res.status(501).send({
        message: "Problem occured while deleting the product",
        success: false,
        data: err.message
      });
    });
});

route.put("/updateReview/:title/:rev", async (req, res) => {

  const { title, rev } = req.params
  try {
    const findBook = await newProduct.findOneAndUpdate
      ({ title: title }, { $push: { review: rev } })
    res.status(200).json({
      message: "Updated",
      success: true,
      data: findBook
    })


  } catch (error) {
    res.status(501).send({
      message: "Problem occured while deleting the product",
      success: false,
      data: error.message
    });
  }




})
module.exports = route;

