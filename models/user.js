const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const crypto = require('crypto');

//Schema
var UserSchema = new Schema({
    email: { type: String, unique: true, loadClass: true },
    password: String,

    facebook: String,
    tokens: Array,

    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: ''}
    },
    contact: { type: String, default: '' },
    address: {
        address1: { type: String, default: '' },
        address2: { type: String, default: '' }, 
        city: { type: String, default: '' },
        district: { type: String, default: '' },
        country: { type: String, default: '' },
        postalCode: { type: String, default: '' },
    },
    history: [{
        paid: { type:Number, default:0 },
        item: { type: Schema.Types.ObjectId, ref: 'Product' },
        created: { type: Date, default: Date.now }
    }],
    isSeller: Boolean,
    created: { type: Date, default: Date.now }
});

//Password Hashing
UserSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//Comparing Password
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size){
    if(!this.size) size = 200;
    if(!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}


module.exports = mongoose.model('User', UserSchema, 'users');