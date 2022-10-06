
const express = require("express");
const dotenv = require('dotenv');
const router = express.Router();
const authController = require('../Controllers/auth');
const customersController = require('../Controllers/customers');

const orderController = require('../Controllers/order');

const GetProducts = require('../Models/products');


dotenv.config({
    path: './.env'
});
 
router.get(['/','/index'], authController.isLoggedIn ,(req ,res) =>{
    console.log('name:' + req.user);

    if(req.session.viewCount){
        req.session.viewCount = req.session.viewCount + 1;
    } else {
        req.session.viewCount = 1;
    }
    //res.send(`<h1>Visited : ${req.session.viewCount} </h1>`);
    //console.log('session ' + req.session.viewCount);

    //res.render('index');
    if (req.user) {
        req.session.SessionUser = req.user;
        res.render("index", { user: req.session.SessionUser , viewcount: req.session.viewCount , title: 'Sig English - AI Speech , Learning Grammar'});
    } else {
        //res.redirect("/signin");
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});

router.get(['/','/registers'],(req ,res) =>{
    res.render('registers',{title: 'Sig English - AI Speech , Learning Grammar'});
});


//Auth
router.get(['/','/profile'], authController.isLoggedIn ,(req ,res) =>{
    console.log('Profile name:' + req.user);
    //res.render('index');
    if (req.user) {
        res.render("profile", { user: req.user , user: req.user});
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});

 
 
router.get([',','/accounts'], authController.isLoggedIn,(req ,res) =>{
    console.log('Accounts name:' + req.user);
    if (req.user) {
        res.render("accounts", { user: req.user });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    } 
});

router.get(['/','/signIn'],(req ,res) =>{
    res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
});

 

router.get(['/','/guides'], authController.isLoggedIn,(req ,res) =>{
    //console.log('name:' + req.user);
    //res.render('index');
    if (req.user) {
        res.render("guides", { user: req.user });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});

router.get(['/','/compronents'], authController.isLoggedIn,(req ,res) =>{
    //console.log('name:' + req.user);
    //res.render('index');
    if (req.user) {
        res.render("compronents", { user: req.user });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});


router.get(['/','/architecture'], authController.isLoggedIn,(req ,res) =>{
    //console.log('name:' + req.user);
    //res.render('index');
    if (req.user) {
        res.render("architecture", { user: req.user });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});

router.get(['/','/blogs'], authController.isLoggedIn,(req ,res) =>{
    //console.log('name:' + req.user);
    //res.render('index');
    if (req.user) {
        res.render("blogs", { user: req.user });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});

router.get(['/','/help'], authController.isLoggedIn,(req ,res) =>{
    //console.log('name:' + req.user);
    //res.render('index');
    if (req.user) {
        res.render("help", { user: req.user });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }
});


//Checkout
router.get([',','/Checkout'],customersController.GetCustomers_basket,(req ,res) =>{
    //console.log('GetCustomers_basket Checkout User:' + req.userData);
    if (req.userData) {        
        res.render("checkout", {paypalClientId: process.env.PAYPAL_CLIENT_ID, 
        userData: req.userData  , 
        user: req.session.SessionUser, 
        cartcount: req.session.viewCount_basket , urlname: process.env.DOMAIN_NAME });    
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    } 
});

//SucessOrders
router.get([',','/sucessorders'],orderController.SucessOrders,(req ,res) =>{
    res.render("sucessorders", {user: req.session.SessionUser });
});


//Order
router.get([',','/orders'],orderController.GetOrder,(req ,res) =>{
    if (req.userData) {
        res.render("orders", { userData: req.userData , user: req.session.SessionUser, cartcount: req.session.viewCount_basket });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }  
});

 
//Products
router.get([',','/products'], GetProducts.Products,(req ,res) =>{
    // console.log('Products name:' + req.userData);
    if (req.userData) {
        res.render("products", { userData: req.userData , user: req.session.SessionUser, cartcount: req.session.viewCount_basket });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }  
});

 
//GStart
router.get([',','/gstart'],authController.isLoggedIn,(req ,res) =>{    
    if (req.user) {
        res.render("gstart", {user: req.session.SessionUser , urlname: process.env.DOMAIN_NAME });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }  
});

//GStart
router.get([',','/gstartbrain'],authController.isLoggedIn,(req ,res) =>{    
    if (req.user) {
        res.render("gstartbrain", {user: req.session.SessionUser , urlname: process.env.DOMAIN_NAME });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }  
});

router.get([',','/apppay'],authController.isLoggedIn,(req ,res) =>{    
    if (req.user) {
        res.render("apppay", {user: req.session.SessionUser , urlname: process.env.DOMAIN_NAME , paypalClientId: process.env.PAYPAL_CLIENT_ID });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }  
});

router.get([',','/adminbrain'],authController.isLoggedIn,(req ,res) =>{    
    if (req.user) {
        res.render("adminbrain", {user: req.session.SessionUser });
    } else {
        res.render('signin', { title: 'Sig English - AI Speech , Learning Grammar' });
    }  
});

 

module.exports = router;
