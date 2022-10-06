//** */
const express = require("express");

const authController = require('../Controllers/auth');
//customers_basket.Customers_basket
const customersController = require('../Controllers/customers');

//createorder.Createorder
//const createorder = require('../Controllers/createorder');

const router = express.Router();
//  POST /auth/Registers
router.post('/Registers', authController.Registers);
 

//   POST /aut/Accounts
router.post('/Accounts', authController.Accounts);


//   POST /auth/SignIn
router.post('/signin', authController.SignIn);


//Logout
router.get('/Logout', authController.Logout);



//post Customers_basket
router.post('/Customers_basket', customersController.Customers_basket);

//post del DelCustomers_basket
router.post('/DelCustomers_basket', customersController.DelCustomers_basket);

//CompleteOrder insert Order
router.post('/CompleteOrder', customersController.CompleteOrder);


// //create-order
// router.post('/Createorder', createorder.Createorder);


module.exports = router;