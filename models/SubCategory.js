// grab the things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Category = require("./Category");
// create a schem
var subCategorySchema = new Schema({
  name: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

// the schema is useless so far
// we need to create a model using it
var Subcategory = mongoose.model("Subcategory", subCategorySchema);

// make this available to our users in our Node applications
module.exports = Subcategory;
