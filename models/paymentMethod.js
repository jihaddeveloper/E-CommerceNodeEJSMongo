const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var PaymentMethodSchema = new Schema({
    created: { type: Date, default: Date.now  },
    name: { type: String, default: '' }
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema, 'paymentMethods');