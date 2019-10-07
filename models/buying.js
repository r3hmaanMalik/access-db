// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
CustomerSchema = mongoose.model('Customer').schema

// create a schema
var buyingSchema = new Schema({
  orderId: mongoose.Schema.Types.ObjectId,
  pi: String,
  po: String,
  customer: CustomerSchema,
  category: String,
  subcategory: String,
  product: Object

});

// the schema is useless so far
// we need to create a model using it
var Buying = mongoose.model('Buying', buyingSchema);

// make this available to our users in our Node applications
module.exports = Buying;