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

    created: { type: Date, default: Date.now },
    serial: { type: String, default: '' },
    name: { type: String },
    
    //for proper searching
    categoryName: { type: String, default: '' },
    subCategoryName: { type: String, default: '' },
    brandName: { type: String, default: '' },

    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    image: String,
    model: { type: String, required: false },
    warranty: { type: String, required: false },
    features: { type: Array, required: false },
    quantity: {
        stock: { type: Number, default: ''},
        storeLive: { type: Number, default: '' }
    },
    productPrice: {
        listPrice: { type: Number},
        purchasePrice: { type: Number}
    },
    discount: { type: Schema.Types.ObjectId, ref: 'Discount' },
    isActive: Boolean,
    shippingInfo: {type:String, default: ''},
    description: { type: String, default: ''},
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    supplier: {},
    uploader: {},
    //pinned: { type: String, required: false },
    //home: { type: String, required: false },
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



//Mongosastic plugin
ProductSchema.plugin(mongoosastic);


module.exports = mongoose.model('Product', ProductSchema, 'products');