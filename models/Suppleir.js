// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// create a schema
var supplierSchema = new Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  region: String,
}, {
  versionKey: false // You should be aware of the outcome after set to false
});

supplierSchema.pre('save', function (next) {
  let now = Date.now()

  this.updatedAt = now
  // Set a value for createdAt only if it is null
  if (!this.created_at) {
    this.created_at = now
  }

  // Call the next function in the pre-save chain
  next()
})


// the schema is useless so far
// we need to create a model using it
var Suppleir = mongoose.model('User', supplierSchema);

// make this available to our users in our Node applications
module.exports = Suppleir;