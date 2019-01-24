const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const keyword = require('keyword');

var FeatureSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    features: { type:Array },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feature', FeatureSchema, 'features');