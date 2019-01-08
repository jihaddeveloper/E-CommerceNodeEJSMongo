const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    serial: { type: String, default: '' },
    description : { type: String, default: '' },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema, 'suppliers');