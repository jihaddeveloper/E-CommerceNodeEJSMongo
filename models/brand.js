const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const keyword = require('keyword');

var BrandSchema = new Schema({
    name: { type: Text, es_type: 'text', unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    feature: { type:Array },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', BrandSchema, 'brands');