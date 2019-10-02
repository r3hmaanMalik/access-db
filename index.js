const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
var faker = require('faker');

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

Mongoose.connect('mongodb://localhost/myappdatabase2');


// if our user.js file is at app/models/user.js
var Suppleir = require('./models/Suppleir');
var Product = require('./models/Product');
var Customer = require('./models/Customer');
var Category = require('./models/Category');
var SubCategory = require('./models/SubCategory');

var Order = require('./models/Order');

// create a new user called chris
for (let index = 0; index < 10; index++) {

    var chris = new Suppleir({
        name: faker.name.firstName(),
        username: faker.name.findName(),
        location: faker.address.city(),
        password: 'password'
    });
}




// // call the custom method. this will just add -dude to his name
// // user will now be Chris-dude


// // chris.dudify(function(err, name) {
// //   if (err) throw err;

// //   console.log('Your new name is ' + name);
// // });



// // call the built-in save method to save to the database
// chris.save(function(err) {
//   if (err) throw err;
//   console.log('User saved successfully!');
// });

/// category
app.get("/categories", async (request, response) => {
    try {
        var result = await Category.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/category", async (request, response) => {
    try {
        var category = new Category(request.body);
        var result = await category.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
/// subcategory
app.get("/subcategories", async (request, response) => {
    try {
        var result = await SubCategory.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/subcategory", async (request, response) => {
    try {
        var subcategory = new SubCategory(request.body);
        var result = await subcategory.save()
        var cat = await Category.findById(request.body.parent)
        cat.subcategories.push(subcategory)
        result = await cat.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

/////

app.get("/", async (request, response) => {
    response.send("result");

});

app.post("/person", async (request, response) => {
    try {
        var suppleir = new Suppleir(request.body);
        var result = await suppleir.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/people", async (request, response) => {
    try {
        var result = await Suppleir.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

//// product


app.post("/product", async (request, response) => {
    try {
        var supL = await Suppleir.findById(request.body.sup).exec();
        var product = new Product(request.body);
        product.supplier = new Suppleir(supL)
        var result = await product.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/products", async (request, response) => {
    try {
        var result = await Product.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});



//// Customer


app.post("/customer", async (request, response) => {
    try {
        var customer = new Customer(request.body);
        var result = await customer.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/customers", async (request, response) => {
    try {
        var result = await Customer.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});



//// orders

app.post("/order", async (request, response) => {
    try {
        var order = new Order(request.body);

        var productList = request.body.items
        var iDs = []
        var supPiDs = []
        productList.forEach(element => {
            iDs.push(element.itemL)

        });
        // console.log(iDs)
        records = await Product.find().where('_id').in(iDs).exec();

        records.forEach(element => {
            supPiDs.push(element.supplier._id)
        });
        suprecords = await Suppleir.find().where('_id').in(supPiDs).exec();

        cusrecord = await Customer.findById(request.body.customer).exec();

        var customer = new Customer(cusrecord);
        order.customer = customer;

        // pr = records[0]
        // var product = new Product(pr);
        // product.supplier = new Suppleir(suprecords[0])


        // var result = await product.save();
        // poop = { item: product }
        getme = order.items

        // getme.forEach(element => {
        //     element.item = product
        // });


        for (let index = 0; index < getme.length; index++) {
            pr = records[index]
            var product = new Product(pr);
            product.supplier = new Suppleir(suprecords[index])
            // const element = array[index];
            getme[index].item = product
        }
        // order.items.push(poop);



        var result = await order.save();


        // records.forEach(element => {
        //     // pr = new Product(element)
        //     su = {
        //         name: "Dock",
        //         location: "Iraq",
        //         password: "password"

        //     }

        //     pr = {
        //         name: "Pa323",
        //         username: "a1a1asala",
        //         category: "String",
        //         SubCategory: "String",
        //         Size: "String",
        //         price: "String",
        //         units: "String",
        //         sup: "5d8dea3fdbc1f12109446982",
        //         supplier: su
        //     }

        //     console.log(pr)
        //     order.items.push({ units: pr, unitPrice: 10, quantity: 20 });
        //     // order.save();
        // });
        // // order.items.push();
        // var result = await order.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/orders", async (request, response) => {
    try {
        var result = await Order.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


/// orders_Specific_product

app.get("/getcustomerorder/:id", async (request, response) => {
    try {
        var id = request.params.id;
        // var result = await Order.findOne({ 'items': { $elemMatch: { customerProductName: "oneplus11" } } }).exec();

        // var result = await Order.findOne({ 'items': { $elemMatch: { 'item.name': "tintin    " } } }).exec();
        // var result = await Order.find({ 'items.customerProductName': 'oneplus11' }).exec(); // working get order by custname
        var result = await Order.find({
            'items.item.supplier.name': 'Linda'
        }).exec(); // working get order by custname

        // var result = await Order.aggregate(
        //     [{
        //         $group: {
        //             _id: '$pi',  //$region is the column name in collection
        //             count: { $sum: 1 }
        //         }
        //     }]
        // ).exec();
        // var result = await Order.aggregate([

        //     { $group: { _id: null, price: { $sum: "price" } } }
        // ]).exec();

        // var result = await Order.aggregate([
        //     { $group: { _id: null, price: { $sum: '$price' } } },
        //     { $project: { _id: 0, price: 1 } }
        // ]).exec(); // working all orders price


        // var result = await Order.aggregate([
        //     { $group: { _id: null, price: { $sum: '$price' } } },
        //     { $project: { _id: 0, price: 1 } }
        // ]).exec(); // working all orders price

        // var result = await Order.aggregate([
        //     { $group: { _id: null, unitPrice: { $sum: '$items.unitPrice' } } },
        //     { $project: { _id: 0, unitPrice: 1 } }
        // ]).exec(); // working all orders price

        // var result = await Order.find();
        // var result = await Order.find().populate('item', 'name').exec()
        // var result = await Order.find({ 'customer._id': id }).exec(); // working get order by cust id
        // var result = await Order.find({ 'customer._id': id }).select('items').exec(); // working get order by cust id show prodcut list

        // var result = await Order.find({
        //     'customer._id': id
        // }).exec(); // working get order by cust id

        // { $match: { price: { $gte: 2122 }, pi: 'Oderc1-2' } }, working

        var result = await Order.aggregate([{
                $match: {
                    'customer._id': Mongoose.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: null,
                    totalprice: {
                        $sum: '$price'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalprice: 1,

                }
            }
        ]).exec();


        response.send(result);


    } catch (error) {
        response.status(500).send(error);
    }
});


app.listen(3000, () => {
    console.log("Listening at :3000...");
});