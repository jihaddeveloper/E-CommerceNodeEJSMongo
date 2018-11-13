const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

const Category = require('../models/category');
const User = require('../models/user');

var ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String },
    price: Number,
    image: String,
    description: { type: String, default: ''},
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now }
});

//Search product plugin
ProductSchema.plugin(mongoosastic, { 
    hosts: [
        'localhost:9200' 
    ]
});



module.exports = mongoose.model('Product', ProductSchema, 'products');