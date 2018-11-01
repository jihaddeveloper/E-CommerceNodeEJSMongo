const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String },
    price: Number,
    image: String
});

//Search product plugin
ProductSchema.plugin(mongoosastic, { 
    hosts: [
        'localhost:9200' 
    ]
});



module.exports = mongoose.model('Product', ProductSchema, 'products');