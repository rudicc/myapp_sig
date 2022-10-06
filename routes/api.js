var express = require('express');
var router = express.Router();
var orderController = require('../Controllers/orderproduct');
var customersController = require('../Controllers/customers');
var customerBasket = require('../Controllers/customer.basket');
var databrainController = require('../Controllers/databrain.controller');

router.get("/getproducts/:id", orderController.GetProducts);

router.get("/getorder-product/:id", orderController.GetorderProduct);
 
router.get("/getorder-contents/:id", orderController.GetContents);

router.get("/getorder-contents_detail/:id", orderController.GetContent_SubDetail);

//getguides-product
router.get("/getguides-product/:id", orderController.GetGuidesProduct);


//MVC customer
/* router.route("/customers/")
    .get(customersController.get_customers)
    .post(customersController.post_customers)
    .put(customersController.update_customers)
    .delete(customersController.delete_customers); */

    //post-customers

router.get("/get-customers/:id",customersController.get_customers);
router.post("/post-customers/",customersController.post_customers);


//new paypal
//  /api/orders
//  /api/orders/:orderID/capture
//router.post("/api/orders",paypalController.createOrder);
//router.post("/api/orders/:orderID/capture",paypalController.capturePayment);


// 
router.get("/get-customer-basket/:id",customerBasket.customer_basket);


//addbrain
router.post("/create-brain", databrainController.Data_OutputBrain);

//net-brain
router.post("/net-brain", databrainController.DataNetBrain);
module.exports = router;