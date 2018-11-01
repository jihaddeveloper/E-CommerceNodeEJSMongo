const router = require('express').Router();

var Category = require('../models/category');

//Add category form
router.get('/add-category', function(req, res, next){
    res.render('admin/addCategory', { message: req.flash('success') });
});


//Add category
router.post('/add-category', function(req, res, next){
    var category = new Category();

    category.name = req.body.name;

    category.save(function(err){
        if(err) return next(err);
        req.flash('success', 'Successfully added a category');
        return res.redirect('/add-category');
    });
});

module.exports = router;