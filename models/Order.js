// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./Product');

// foriegn  Schemas
ProductSchema = mongoose.model('Product').schema
CustomerSchema = mongoose.model('Customer').schema

// create a schema

var orderSchema = new Schema({
  pi: String,
  po: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Shipped', 'Unshipped'],
    default: 'Unshipped'
  },
  ETD: Date,
  payment: {
    deposit: Number,
    balance: Number
  },
  SubCategory: String,
  Size: String,
  price: Number,
  color: String,
  units: String,
  created_at: Date,
  customer: CustomerSchema,
  items: [{
    item: ProductSchema,
    itemL: mongoose.Schema.Types.ObjectId,
    // product: Product,
    unitPrice: Number,
    quantity: Number,
    netPrice: Number,
    netPurchasePrice: Number,
    customerProductName: String
  }],


});


// //custom method for total order

// orderSchema.methods.getTotal = function(items) {
//   // add some stuff to the users name

// const average = items => items.reduce( ( p, c ) => p + c, 0 );
// // const result = average( items ); // 5
//   return average;
// };

orderSchema.pre("save", function (next) {
  let now = new Date();
  this.created_at = now;
  console.log(this.price)
  var total = 0
  var purchasetotal = 0
  this.items.forEach(element => {
    element.netPrice = element.unitPrice * element.quantity
    total = total + element.netPrice
    element.netPurchasePrice = element.item.price * element.quantity

  });

  this.price = total
  console.log(this.price)
  this.payment.balance = this.price - this.payment.deposit

  next();
});

// orderSchema.pre('save', () => console.log('Hello from pre save'));
// orderSchema.pre('save', async function () {
//   await doStuff();

// });


// async function doStuff() {
//   let now = new Date();
//   this.created_at = now;
// }


// the schema is useless so far
// we need to create a model using it
orderSchema.plugin(require('mongoose-autopopulate'));
var Order = mongoose.model('Order', orderSchema);

// make this available to our users in our Node applications
module.exports = Order;