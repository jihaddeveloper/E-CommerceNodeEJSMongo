// module.exports = function SessionCart(oldCart){

//     this.items = oldCart.items || {};
//     this.totalQuantity = oldCart.totalQuantity || 0;
//     this.totalPrice = oldCart.totalPrice || 0;

//     this.add = function(item, id){
//         var storedItem = this.items[id];
//         if(!storedItem){
//             storedItem = this.items[id] = {item: item, quantity: 0, price: 0};
//         }
//         storedItem.quantity++;
//         storedItem.price = storedItem.item.productPrice.listPrice * storedItem.quantity;
//         this.totalQuantity++;
//         this.totalPrice += storedItem.item.productPrice.listPrice;
//     };

//     this.generateArray = function() {
//         var arr = [];
//         for(var id in this.items){
//             arr.push(this.items[id]);
//         }
//         return arr;
//     };
// };


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// var SessionCartSchema = new Schema({
//     owner: { type: Schema.Types.ObjectId, ref: 'User' },
//     items: [{ 
//         item: { type: Schema.Types.ObjectId, ref: 'Product' },
//         quantity: { type: Number, default: 1 },
//         price: { type: Number, default: 0}
//     }],
//     totalQuantity: { type: Number, default: 0 },
//     totalPrice: { type: Number, default: 0 }
// });

// module.exports = mongoose.model('SessionCart', SessionCartSchema, 'sessionCarts');
