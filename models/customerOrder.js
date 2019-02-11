const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

var CustomerOrderSchema = new Schema({
    created: { type: Date,default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Object },
    // cart:[
    //     {
    //         product:{ type: Schema.Types.ObjectId, ref: 'Product' },
    //         quntity: { type: Number },
    //         price:{ type: Number },
    //         unitPrice:{ type: Number }
    //     }
    // ],
    name: { type: String },
    phone: { type: Number },
    address: { type: String },
    city: { type: String },
    division: { type: String },
    paymentMethod: { type: String },
    paymentId: { type: String },
    shippingCost: { type: Number },
    totalAmount: { type: Number },
    currentStatus:{ type: String, default: 'New Order' },
    history:{ type: Array },
    lastModified:{ type: Date, default: Date.now},
});

CustomerOrderSchema.plugin(mongoosastic);

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema, 'customerOrders');