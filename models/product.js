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
    name: { type: Text },
    
    //for proper searching
    categoryName: { type: String, default: '' },
    subCategoryName: { type: String, default: '' },
    brandName: { type: String, default: '' },
   
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    features: { type: Array },

    model: { type: String, required: false },
    warranty: { type: String, required: false },
    image: { type: String },

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
    live: { type: Schema.Types.ObjectId, ref: 'Live' },
    blockQuantity: { type: Number, default: 0 },
    unitPrice: { type: Number },
    isActive:{ type: Boolean, required: false },
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