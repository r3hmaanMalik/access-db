const Mongoose = require("mongoose");
var faker = require('faker');


Mongoose.connect('mongodb://localhost/myappdatabase2');


// if our user.js file is at app/models/user.js
var Suppleir = require('./models/Suppleir');
var Product = require('./models/Product');
var Customer = require('./models/Customer');

var Category = require('./models/Category');
var SubCategory = require('./models/SubCategory');
var Order = require('./models/Order');
var Od = require('./models/Od');

// create a new user called chris
console.log("rejmam")

function supplierFeed(much) {
    for (let index = 0; index < much; index++) {
        console.log(index)
        var chris = new Suppleir({
            name: faker.name.firstName(),
            phone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            address: faker.address.secondaryAddress(),
            region: faker.address.country()
        });
        chris.save(function (err) {
            if (err) return handleError(err);
            // saved!
        });

    }
}

function customerFeed(much) {
    for (let index = 0; index < much; index++) {
        console.log(index)
        var chris = new Customer({
            companyName: faker.company.companyName(),
            phone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            contactPersonName: faker.name.firstName(),
            contactPersonPhone: faker.phone.phoneNumber(),
            companyLogo: faker.image.imageUrl(),
        });
        chris.save(function (err) {
            if (err) return handleError(err);
            // saved!
        });

    }
}


async function catFeed(much) {
    for (let index = 0; index < much; index++) {
        console.log(index)
        var chris = new Category({
            name: faker.commerce.product()

        });
        chris.save(function (err) {
            if (err) return handleError(err);
            // saved!
        });

    }
}


async function subcatFeed(much) {


    Array.prototype.random = function () {
        return this[Math.floor((Math.random() * this.length))];
    }

    var cats = await Category.find();
    arr = []

    cats.forEach(element => {
        // console.log(element._id)
        arr.push(element._id)
    });

    for (let index = 0; index < much; index++) {
        console.log(index)
        pid = arr.random();
        var chris = new SubCategory({
            name: faker.commerce.product(),
            parent: pid
        });
        chris.save(function (err) {
            if (err) return handleError(err);
            // saved!
        });


        var cat = await Category.findById(pid)
        cat.subcategories.push(chris)
        result = await cat.save();
    }


}







async function productFeed(much) {
    for (let index = 0; index < much; index++) {

        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        }

        var supall = await Suppleir.find().exec();
        // console.log(supall.random()._id)

        var supL = await Suppleir.findById(supall.random()._id).exec();

        // console.log(supL)

        var chris = new Product({
            name: faker.name.firstName(),
            username: faker.name.lastName(),
            category: faker.commerce.productAdjective(),
            SubCategory: "String",
            Size: "String",
            price: faker.commerce.price(10, 50, 2),
            units: "String",
            sup: "5d8dea3fdbc1f12109446982"
        });
        chris.supplier = new Suppleir(supL)

        chris.save(function (err) {
            if (err) return handleError(err);
            // saved!
        });
    }
}






async function productFeedHaroon(much) {
    for (let index = 0; index < much; index++) {
        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        }
        var supall = await Suppleir.find().exec();
        var catall = await Category.find().exec();
        // var subcatall = await SubCategory.find().exec();
        // console.log(supall.random()._id)
        var supL = await Suppleir.findById(supall.random()._id).exec();
        var catL = await Category.findById(catall.random()._id).exec();
        // console.log(catL._id);
        // var subcatall = await SubCategory.find().exec();
        // records = await SubCategory.find().where('parent').in(subcatall).exec();
        // console.log(records);
        // console.log(catall);
        // console.log(subcatall);
        // var subCat = await SubCategory.findById(subcatall.random()._id).exec();
        // console.log(supL);
        // console.log(catL.name);
        var chris = new Product({
            name: faker.commerce.productName(),
            category: catL.name,
            subCategory: catL.name,
            discription: faker.lorem.text(),
            size: faker.random.number(),
            price: faker.commerce.price(10, 50),
            unit: "pcs",
            packingDetails: faker.lorem.text(),
            CBM: faker.random.number(),
            color: faker.internet.color(),
            supplierProductName: faker.commerce.product(),
            supplierId: supL._id,
            supplier: supL,
            // created_at: Date.now
            // created_at: {
            //     type: Date,
            //     default: Date.now
            //   }
        });
        // console.log(chris);
        chris.save(function (err) {
            if (err)
                console.log(err)
            // saved!
        });
    }
}





async function orderFeed(much) {
    await Order.remove();
    for (let index = 0; index < much; index++) {
        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        }
        var supall = await Suppleir.find().exec();
        var catall = await Category.find().exec();
        var subcatall = await SubCategory.find().exec();
        var custall = await Customer.find().exec();
        var proall = await Product.find().exec();
        // console.log(supall.random()._id)
        // console.log(proall);
        var supL = await Suppleir.findById(supall.random()._id).exec();
        var catL = await Category.findById(catall.random()._id).exec();
        var custL = await Customer.findById(custall.random()._id).exec();
        custL.openorders += 1
        custL.save();
        var proL = await Product.findById(proall.random()._id).exec();
        var subcatL = await SubCategory.findById(subcatall.random()._id).exec();
        // console.log(subcatL.name);
        var r_number = faker.random.number({
            min: 2,
            max: 5
        });
        itemsList = []
        for (let index = 0; index < r_number; index++) {
            // console.log(index)
            var proL = await Product.findById(proall.random()._id).exec();

            var obj = {
                item: proL,
                itemL: proL._id,
                // product: Product,
                unitPrice: faker.random.number({
                    min: 60,
                    max: 150
                }),
                quantity: faker.random.number(1000),
                // netPrice: faker.random.number(),
                customerProductName: faker.commerce.product()
            }
            itemsList.push(obj);

        }
        // console.log(itemsList);

        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        };


        statusType = ['Shipped', 'Unshipped']
        var chris = new Order({
            pi: faker.random.number(),
            po: faker.random.number(),
            status: statusType.random(),
            // po: {
            //   type: "String",
            //   required: true
            // },
            // status: {
            //   type: "String",
            //   enum: ['Shipped', 'Unshipped'],
            //   default: 'Unshipped'
            // },
            ETD: new Date().addDays(2),
            payment: {
                deposit: faker.random.number(100, 500, 3),
            },
            SubCategory: subcatL.name,
            Size: faker.random.number(),
            price: faker.commerce.price(),
            color: faker.internet.color(),
            units: "pcs",
            created_at: '',
            customer: custL,
            items: itemsList
        });
        console.log(chris);
        chris.save(function (err) {
            if (err) return console.log(err);
            // saved!
        });
    }
}







async function odFeed(much) {
    await Od.remove();
    for (let index = 0; index < much; index++) {
        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        }
        var supall = await Suppleir.find().exec();
        var catall = await Category.find().exec();
        var subcatall = await SubCategory.find().exec();
        var custall = await Customer.find().exec();
        var proall = await Product.find().exec();
        // console.log(supall.random()._id)
        // console.log(proall);
        var supL = await Suppleir.findById(supall.random()._id).exec();
        var catL = await Category.findById(catall.random()._id).exec();
        var custL = await Customer.findById(custall.random()._id).exec();
        custL.openorders += 1
        custL.save();
        var proL = await Product.findById(proall.random()._id).exec();
        var subcatL = await SubCategory.findById(subcatall.random()._id).exec();
        // console.log(subcatL.name);
        var r_number = faker.random.number({
            min: 2,
            max: 5
        });
        itemsList = []
        for (let index = 0; index < r_number; index++) {
            // console.log(index)
            var proL = await Product.findById(proall.random()._id).exec();

            var obj = {
                product: {
                    item: proL,
                    itemL: proL._id,
                    // product: Product,
                    unitPrice: faker.random.number({
                        min: 60,
                        max: 150
                    }),
                    quantity: faker.random.number(1000),
                    // netPrice: faker.random.number(),
                    customerProductName: faker.commerce.product()
                }
            }
            itemsList.push(obj);

        }
        // console.log(itemsList);

        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        };


        statusType = ['Shipped', 'Unshipped']
        var chris = new Od({
            pi: faker.random.number(),
            po: faker.random.number(),
            status: statusType.random(),
            // po: {
            //   type: "String",
            //   required: true
            // },
            // status: {
            //   type: "String",
            //   enum: ['Shipped', 'Unshipped'],
            //   default: 'Unshipped'
            // },
            ETD: new Date().addDays(2),
            payment: {
                deposit: faker.random.number(100, 500, 3),
            },
            SubCategory: subcatL.name,
            Size: faker.random.number(),
            price: faker.commerce.price(),
            color: faker.internet.color(),
            units: "pcs",
            created_at: '',
            customer: custL,
            items: itemsList
        });
        console.log(chris);
        chris.save(function (err) {
            if (err) return console.log(err);
            // saved!
        });
    }
}






// supplierFeed(10);
// customerFeed(10);
// productFeed(10);
// customerFeed(10); 
// catFeed(10);
// subcatFeed(10);
// productFeedHaroon(25);
// orderFeed(10);
odFeed(10);