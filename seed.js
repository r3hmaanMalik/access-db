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
            price: faker.commerce.price(10, 500, 3, "$"),
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

// supplierFeed(10);
// customerFeed(10);
// productFeed(10);
// customerFeed(10); 
// catFeed(10);
subcatFeed(10);