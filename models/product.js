const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');
const nested = require('nested');
const Category = require('../models/category');
const User = require('../models/user');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const SubCategory = require('../models/subCategory');

var ProductSchema = new Schema({

    created: { type: Date, default: Date.now },
    
   //product info
    name: { type: Text },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    features: { type: Array },
    description: { type: String, default: ''},
    model: { type: String, required: false },
    warranty: { type: String, required: false },
    image: { type: String },
    weight: { type: String },


    //for proper searching
    categoryName: { type: String, default: '' },
    subcategoryName: { type: String, default: '' },
    brandName: { type: String, default: '' },

    //is live or not
    isActive:{ type: Boolean, required: false },

    //to send live
    live: { 
        quantity: {type:Number,default:0},
        serial: {type: Array,default:[]},
        admin: { type: Schema.Types.ObjectId, ref: 'users' },
        created: { type: Date, default: Date.now },
    },
    
    //for live-stock check
    frontQuantity: {type:Number, default:0},

    //sell price
    unitPrice: { type: Number },
    

    //shipping Info
    shippingInfo: {type:String, default: ''},
    
    //unused
    status: { type: Boolean, required: false },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    discount: { type: Schema.Types.ObjectId, ref: 'Discount' }
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




module.exports = mongoose.model('Product', ProductSchema, 'products');