// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Supplier = require('./Suppleir')
SupplierSchema = mongoose.model('User').schema


// create a schema
var productSchema = new Schema({
  name: String,
  category: String,
  subCategory: String,
  discription: String,
  size: String,
  price: String,
  unit: {
    type: String,
    enum: ['pcs', 'set', 'box']
  },
  packingDetails: String,
  CBM: Number,
  color: String,
  supplierProductName: String,
  supplierId: mongoose.Schema.Types.ObjectId,
  supplier: SupplierSchema,
  created_at: {
    type: Date,
    default: Date.now
  }
});


// the schema is useless so far
// we need to create a model using it
productSchema.plugin(require('mongoose-autopopulate'));
var Product = mongoose.model('Product', productSchema);


// make this available to our users in our Node applications
module.exports = Product;