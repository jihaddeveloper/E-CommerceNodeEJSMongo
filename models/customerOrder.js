const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CustomerOrderSchema = new Schema({
    created: { type: Date,default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product' },
        quantity:{ type: Number },
        unitPrice: { type: Number },
        price:{ type: Number },
    }
    ],
    name: { type: String },
    phone: { type: Number },
    address: { type: String },
    city: { type: String },
    paymentMethod: { type: String },
    paymentId: { type: String },
    shippingCharge: { type: Number },
    totalAmount: { type: Number },
    currentStatus:{ type: String, default: 'New Order' },
    history:{ type: Array },
    lastModified:{ type: Date, default: Date.now},
});



module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema, 'customerOrders');