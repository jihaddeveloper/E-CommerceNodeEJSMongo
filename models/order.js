const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
const Text = require('text/lib/text');

var OrderSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    orderNumber: { type: String, default: '' },
    invoiceNumber: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    paid: {
        type: Number,
        default: 0
    },
    items: [{
        item: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0}
    }],
    
    paymentMethod: { type: String, default: '' },
    cardHolderName: { type: Schema.Types.ObjectId, ref: 'User' },
    creditCardLast4Digits: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
    shippingMethods: { type: String, default: '' },
    shippingFees: { type: Number, default: '' },
    taxes: [{}],
    promoCodes: [{}],
    paymentTransactionId: {},
    finalGrandTotal: { type: Number, default: '' }
});

OrderSchema.plugin(mongoosastic);

module.exports = mongoose.model('Order', OrderSchema, 'orders');