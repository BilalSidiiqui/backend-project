const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
  _id: new mongoose.Schema.Types.ObjectId(),
  title: { type: String, required: true },
  author: { type: String, required: true },
  ISBN_number: { type: String, required: true },
  productImages: { type: String, required: true },
  review:[String]
});
module.exports = mongoose.model("Products", productsSchema);
