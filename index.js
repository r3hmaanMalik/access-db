const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
var faker = require("faker");
const fileUpload = require('express-fileupload');

var app = Express();

app.use(BodyParser.json());
app.use(
    BodyParser.urlencoded({
        extended: true
    })
);
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    debug: true
}));

// Mongoose.connect("mongodb://localhost/myappdatabase2");
Mongoose.connect(
    "mongodb+srv://admin:admin@cluster0-6a3l3.mongodb.net/excessmongoosedb?retryWrites=true&w=majority"
);

// if our user.js file is at app/models/user.js
var Suppleir = require("./models/Suppleir");
var Product = require("./models/Product");
var Customer = require("./models/Customer");
var Category = require("./models/Category");
var SubCategory = require("./models/SubCategory");

var Order = require("./models/Order");
var Od = require("./models/Od");
var Buying = require("./models/buying");

// create a new user called chris
for (let index = 0; index < 10; index++) {
    var chris = new Suppleir({
        name: faker.name.firstName(),
        username: faker.name.findName(),
        location: faker.address.city(),
        password: "password"
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
        var result = await subcategory.save();
        var cat = await Category.findById(request.body.parent);
        cat.subcategories.push(subcategory);
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

app.post("/supplier", async (request, response) => {
    try {
        var suppleir = new Suppleir(request.body);
        var result = await suppleir.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/suppliers", async (request, response) => {
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
        var supL = await Suppleir.findById(request.body.supplierId).exec();
        var product = new Product(request.body);
        product.supplier = new Suppleir(supL);
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

        var productList = request.body.items;
        var iDs = [];
        var supPiDs = [];
        productList.forEach(element => {
            iDs.push(element.itemL);
        });
        // console.log(iDs)
        records = await Product.find()
            .where("_id")
            .in(iDs)
            .exec();

        records.forEach(element => {
            supPiDs.push(element.supplier._id);
        });
        suprecords = await Suppleir.find()
            .where("_id")
            .in(supPiDs)
            .exec();

        var cusrecord = await Customer.findById(request.body.customer).exec();

        cusrecord.openorders += 1;
        var custpush = await cusrecord.save();
        var customer = new Customer(custpush);
        order.customer = customer;

        // pr = records[0]
        // var product = new Product(pr);
        // product.supplier = new Suppleir(suprecords[0])

        // var result = await product.save();
        // poop = { item: product }
        getme = order.items;

        // getme.forEach(element => {
        //     element.item = product
        // });

        for (let index = 0; index < getme.length; index++) {
            pr = records[index];
            var product = new Product(pr);
            product.supplier = new Suppleir(suprecords[index]);
            // const element = array[index];
            getme[index].item = product;
        }
        // order.items.push(poop);

        // var result = await order.save();
        response.send(custpush);
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

//// get order by id
app.get("/order/:id", async (request, response) => {
    try {
        var id = request.params.id;
        var result = await Order.find({
            _id: id
        }).exec(); // working get order by cust id
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

/// orders_Specific_product

app.get("/getcustomerorders/:id", async (request, response) => {
    try {
        var id = request.params.id;
        var result = await Order.find({
            "customer._id": id
        }).exec(); // working get order by cust id
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/allopenorders", async (request, response) => {
    try {
        var result = await Customer.aggregate([{
            $group: {
                _id: null,
                totalopenorders: {
                    $sum: "$openorders"
                }
            }
        }]).exec(); // working get order by cust id

        response.send(result[0]);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/getcustomerorder/:id", async (request, response) => {
    try {
        var id = request.params.id;
        // var result = await Order.findOne({ 'items': { $elemMatch: { customerProductName: "oneplus11" } } }).exec();

        // var result = await Order.findOne({ 'items': { $elemMatch: { 'item.name': "tintin    " } } }).exec();
        // var result = await Order.find({ 'items.customerProductName': 'oneplus11' }).exec(); // working get order by custname
        var result = await Order.find({
            "items.item.supplier.name": "Linda"
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

        var statsAll = await Order.aggregate([{
                $match: {
                    "customer._id": Mongoose.Types.ObjectId(id)
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: null,
                    totalsale: {
                        $sum: "$items.netPrice"
                    },
                    totalbalance: {
                        $sum: "$payment.balance"
                    },
                    totalpurchase: {
                        $sum: "$items.netPurchasePrice"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalsale: 1,
                    totalbalance: 1,
                    totalpurchase: 1
                }
            }
        ]).exec();

        var statsShipped = await Order.aggregate([{
                $match: {
                    "customer._id": Mongoose.Types.ObjectId(id),
                    status: "Shipped"
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: null,
                    totalsale: {
                        $sum: "$items.netPrice"
                    },
                    totalbalance: {
                        $sum: "$payment.balance"
                    },
                    totalpurchase: {
                        $sum: "$items.netPurchasePrice"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalsale: 1,
                    totalbalance: 1,
                    totalpurchase: 1
                }
            }
        ]).exec();

        var statsUnshipped = await Order.aggregate([{
                $match: {
                    "customer._id": Mongoose.Types.ObjectId(id),
                    status: "Unshipped"
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: null,
                    totalsale: {
                        $sum: "$items.netPrice"
                    },
                    totalbalance: {
                        $sum: "$payment.balance"
                    },
                    totalpurchase: {
                        $sum: "$items.netPurchasePrice"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalsale: 1,
                    totalbalance: 1,
                    totalpurchase: 1
                }
            }
        ]).exec();

        var result = await Order.find({
            "customer._id": id
        }).exec(); // working get order by cust id

        stats = {
            statsAll: statsAll[0],
            statsShipped: statsShipped[0],
            statsUnshipped: statsUnshipped[0]
        };

        collection = {
            stats: stats,
            orders: result
        };

        response.send(collection);
    } catch (error) {
        response.status(500).send(error);
    }
});

//// test OD

app.get("/ods", async (request, response) => {
    try {
        var result = await Od.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/buyings", async (request, response) => {
    try {
        var id = request.params.id;
        var result = await Buying.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/buyings/:id", async (request, response) => {
    try {
        var id = request.params.id;
        var result = await Buying.find({
            "product.item.supplierId": Mongoose.Types.ObjectId(id)
        }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

///test

app.post("/testgetsupplierdetails", async (request, response) => {
    try {
        var body = request.body;

        if (body.customerId == null) {
            var products = await Buying.find({
                "product.item.supplierId": Mongoose.Types.ObjectId(body.supplierId)
            }).exec();

            var orders = await Od.find({
                "items.product.item.supplierId": Mongoose.Types.ObjectId(
                    body.supplierId
                )
            }).exec(); // working get order by cust id\

            var suppleirtotalpurchase = await Buying.aggregate([{
                    $match: {
                        "product.item.supplierId": Mongoose.Types.ObjectId(body.supplierId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalsale: {
                            $sum: "$product.netPurchasePrice"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalsale: 1
                    }
                }
            ]).exec();

            collection = {
                stats: {
                    totalSales: suppleirtotalpurchase[0].totalsale
                },
                product: products,
                orders: orders
            };
        } else {
            var products = await Buying.find({
                "product.item.supplierId": Mongoose.Types.ObjectId(body.supplierId),
                "customer._id": Mongoose.Types.ObjectId(body.customerId)
            }).exec();

            var orders = await Od.find({
                "items.product.item.supplierId": Mongoose.Types.ObjectId(
                    body.supplierId
                ),
                "customer._id": Mongoose.Types.ObjectId(body.customerId)
            }).exec(); // working get order by cust id\

            var customertotalsale = await Od.aggregate([{
                    $match: {
                        "customer._id": Mongoose.Types.ObjectId(body.customerId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalsale: {
                            $sum: "$price"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalsale: 1
                    }
                }
            ]).exec();

            var suppliercontribution = await Buying.aggregate([{
                    $match: {
                        "product.item.supplierId": Mongoose.Types.ObjectId(body.supplierId),
                        "customer._id": Mongoose.Types.ObjectId(body.customerId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalsale: {
                            $sum: "$product.netPrice"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalsale: 1
                    }
                }
            ]).exec();

            var suppleirtotalpurchase = await Buying.aggregate([{
                    $match: {
                        "product.item.supplierId": Mongoose.Types.ObjectId(body.supplierId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalsale: {
                            $sum: "$product.netPurchasePrice"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalsale: 1
                    }
                }
            ]).exec();

            collection = {
                stats: {
                    totalSales: suppleirtotalpurchase[0].totalsale,
                    totalCustomerSales: customertotalsale[0].totalsale,
                    contribution: suppliercontribution[0].totalsale,
                    contributionPercentage: (suppliercontribution[0].totalsale /
                            customertotalsale[0].totalsale) *
                        100
                },
                product: products,
                orders: orders
            };
        }
        response.send(collection);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/getsupplierdetails/:id", async (request, response) => {
    try {
        var id = request.params.id;

        var products = await Buying.find({
            "product.item.supplierId": Mongoose.Types.ObjectId(id)
        }).exec();

        var orders = await Od.find({
            "items.product.item.supplierId": Mongoose.Types.ObjectId(id)
        }).exec(); // working get order by cust id\

        var stats = await Buying.aggregate([{
                $match: {
                    "product.item.supplierId": Mongoose.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: null,
                    totalsale: {
                        $sum: "$items.product.netPurchasePrice"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalsale: 1
                }
            }
        ]).exec();

        collection = {
            stats: {
                totalSales: 0,
                totalCustomerSales: 0,
                contribution: 0,
                contributionPercentage: 0
            },
            product: products,
            orders: orders
        };

        response.send(collection);
    } catch (error) {
        response.status(500).send(error);
    }
});

/// filter product

app.post("/filter", async (request, response) => {
    try {
        var req = request.body;
        const qurey = {};
        const entries = Object.keys(req);

        if (req.pi == null && req.po == null) {
            entries.forEach(element => {
                switch (element) {
                    case "customerId":
                        qurey["customer._id"] = Mongoose.Types.ObjectId(req.customerId);
                        break;
                    case "category":
                        qurey["product.item.category"] = req.category;
                        break;
                    case "subcategory":
                        qurey["product.item.subCategory"] = req.subcategory;
                        break;
                    default:
                        break;
                }
            });
        } else {
            entries.forEach(element => {
                switch (element) {
                    case "pi":
                        qurey["pi"] = req.pi;
                        break;
                    case "po":
                        qurey["po"] = req.po;
                        break;
                    default:
                        break;
                }
            });
        }
        // const q = {
        //   "product.item.supplierId": Mongoose.Types.ObjectId(body.supplierId),
        //   "customer._id": Mongoose.Types.ObjectId(body.customerId)
        // };
        var products = await Buying.find(qurey).exec();

        response.send(products);
    } catch (error) {
        response.status(500).send(error);
    }
});

///upload Test
app.post('/upload', function (request, res) {
    if (!request.files || Object.keys(request.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = request.files.companyLogo;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('uploads/' + sampleFile.name, function (err) {
        if (err) {
            return res.status(500).send(err);
        } else {
            var customer = new Customer(request.body);
            customer.companyLogo = 'uploads/' + sampleFile.name
            customer.save();
            res.send('File uploaded!');
        }
    });
    // res.send(sampleFile);

});
app.post("/testcustomer", async (request, response) => {
    try {
        var customer = new Customer(request.body);
        var result = await customer.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening at :3000...");
});