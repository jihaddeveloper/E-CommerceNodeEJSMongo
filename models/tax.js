const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    amount: { type: Number, default: 0 },
    description : { type: String, default: '' },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tax', taxSchema, 'taxes');