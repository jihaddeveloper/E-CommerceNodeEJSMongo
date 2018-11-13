const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');