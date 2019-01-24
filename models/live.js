const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const keyword = require('keyword');

var LiveSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    serial: [{}],
    quantity: { type: Number },
    unitPrice: { type: Number },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Live', LiveSchema, 'lives');