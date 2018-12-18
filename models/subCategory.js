const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const keyword = require('keyword');

var SubCategorySchema = new Schema({
    name: { type: Text, es_type: 'text', unique: true },
    category: { type: Schema.Types.ObjectId, ref:'Category'  },
    features:{ type: Array },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubCategory', SubCategorySchema, 'subCategories');