const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const keyword = require('keyword');

var InventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    serial: [{}],
    quantity: { type: Number },
    purchasePrice: { type: Number },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema, 'inventories');