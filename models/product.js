const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const nested = require('nested');
const Category = require('../models/category');
const User = require('../models/user');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const SubCategory = require('../models/subCategory');

var ProductSchema = new Schema({

    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String },
    image: String,
    description: { type: String, default: ''},
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    model: { type: String, required: false },
    warranty: { type: String, required: false },
    pinned: { type: String, required: false },
    home: { type: String, required: false },
    features: { type: Array, required: false },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    quantity: {
        stock: { type: Number, default: ''},
        storeLive: { type: Number, default: '' }
    },
    productPrice: {
        listPrice: { type: Number},
        salePrice: { type: Number},
        wholeSalePrice: { type: Number}
    },
    isActive: Boolean,
    onSale: Boolean,
    shippingInfo: {type:String},
    created: { type: Date, default: Date.now }
    //toObject: { virtuals: true },
    //toJSON: { virtuals: true }
});


ProductSchema
.virtual('avarageRating')
.get(function(){
    var rating = 0;
    if(this.reviews.length == 0){
        rating = 0;
    } else{
        this.reviews.map((reviw) =>{
            rating += reviw.rating;
        });
        rating = rating / this.reviews.length;
    }
    return rating;
});
//Deep Populate plugin
ProductSchema.plugin(deepPopulate);

//Search product plugin
// ProductSchema.plugin(mongoosastic, { 
//     hosts: [
//         'localhost:9200' 
//     ]
// });

ProductSchema.plugin(mongoosastic);

//Mongosastic plugin



module.exports = mongoose.model('Product', ProductSchema, 'products');