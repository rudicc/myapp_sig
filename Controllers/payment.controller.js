//import axios from "axios";
const axios= require('axios');
const mysql = require("mysql");
const dotenv = require('dotenv');

const newDate = new Date(); 
dotenv.config({
    path: './.env'
});

const db = mysql.createConnection({
    host     : process.env.DATABASE_HOST, 
    port     : process.env.DATABASE_PORT,
    user     : process.env.DATABASE_USER, 
    password : process.env.DATABASE_PASSWORD, 
    database : process.env.DATABASE_NAME
});

let HOST = process.env.NODE_ENV === "production"? process.env.PAY_HOST : "http://localhost:" + process.env.PORT;
let CLIENT_ID = "";     // process.env.PAYPAL_CLIENT_ID;
let CLIENT_SECRET = "";  // process.env.PAYPAL_CLIENT_SECRET;
db.connect((error) =>{
    if(error){
        console.log('Payment Not MySql connect !' + error);
    }else{
        console.log("Payment Mysql connected...");
     //SELECT `client_id, client_secret, client_type  FROM paymanagers where active=1
         try{         
              var sql = "SELECT client_id, client_secret, host, client_type    FROM paymanagers where active=1";
              db.query(
                  sql,
                (error, result) => {
                  if (error) {
                    console.log(error);
                      CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
                      CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
                  } else {                  
                    CLIENT_ID = result[0].client_id.replace("Ae_","");
                    CLIENT_SECRET = result[0].client_secret.replace("Ac_","");
                    if(result[0].client_type==2){
                      HOST = result[0].host; //+  process.env.PORT;
                    }else{
                      HOST = result[0].host;
                    }
                   
                    console.log('My host ok ! : ' +  CLIENT_ID );
                  }
                }
            );
          }catch(err){
            console.log(err);
            CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
            CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;            
          } 
    }
});

 exports.createOrder = async (req, res) => {
  try {

    //const total  =  0.10; //storeItems(id);

    var id;
    var price;
    req.body.items.map(item =>{
      id =    item.id;
      price = item.price;

    });
 
    //** Get amunt */
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price,
          },
        },
      ],
      application_context: {
        brand_name: "SIG English",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/payment.routes/capture-order`,
        cancel_url: `${HOST}/payment.routes/cancel-payment`,
      },
    };


    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    console.log('access_token : ' + access_token);

    // make a request
    const response = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data);

    return res.json(response.data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Something goes wrong");
  }
};

exports.captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    console.log(response.data);

    console.log('Ok captureOrder!');

    res.redirect("/payment.routes/manager-order");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

exports.cancelPayment = (req, res , next) => {
  res.redirect("/checkout");
  next();
};

exports.managerOrder =  async (req, res , next) => {
  const { id, username, email, languages_id } = req.session.SessionUser;  
    try{  
      //#insert into orders(customers_id, customers_name)values(5,'abc@mmail.com')
      sql = "insert into orders(customers_id, customers_name)values("+ id +",'"+ email +"')";
      db.query(
          sql,
        (error, result) => {
          if (error) {
            console.log(error);
          } else {                  
                      
              console.log("Ok! Orders !");
              try{
                  var vsql = "";
                  vsql += " insert into orders_products SELECT 0 as orders_products_id,orders.orders_id as orders_id  ";
                  vsql += " , customers_basket.products_id as products_id  ";
                  vsql += " , products.products_model as products_model  ";
                  vsql += " , products_description.products_name as products_name  ";
                  vsql += " , products.products_price as products_price  ";
                  vsql += " , customers_basket.final_price as final_price  ";
                  vsql += " , products.products_tax_class_id as products_tax  ";
                  vsql += " , customers_basket.customers_basket_quantity as products_quantity  ";
                  vsql += " , (customers_basket.customers_basket_quantity * 60) as orders_quantity_minute,(customers_basket.customers_basket_quantity * 3600) as  orders_quantity_secound ";
                  vsql += " FROM ((orders  ";
                  vsql += "   INNER JOIN customers_basket ON orders.customers_id = customers_basket.customers_id)  ";
                  vsql += "   INNER JOIN products ON customers_basket.products_id = products.products_id)  ";
                  vsql += "   INNER JOIN products_description ON products.products_id = products_description.products_id  ";
                  vsql += " WHERE (((products_description.languages_id)=1) AND ((orders.customers_id)="+ id +"))";                
                  
                  db.query(vsql,(error,results) =>{
                      if (error) {
                          console.log(error);
                          } else {
                              //delete  FROM customers_basket where  customers_id=5
                              db.query("delete  FROM customers_basket where  customers_id=?", id ,(error,resultss) =>{
                                  if (error) {
                                      console.log(error);
                                      } else {                                             
                                          if(req.session.viewCount_basket){  
                                            req.session.viewCount_basket = null;                                                                                                       
                                          }             
                                          console.log("ok ! delete");
                                      }
                              }); 
                              console.log("ok ! insert into order product");
                          }
                  });
              }catch(err){
                  console.log(err);
                  //insert log
              }
          }
        }
    );
  }catch(err){
      console.log(err);
  }
  //** SucessOrders */
  res.redirect("/gstart");
  next();

};

//Qr
//post
exports.GetExchangeReate  =  async (req, res , next) => { 
  try{
      req.body.items.map(item =>{
         var itemrate = item.rateusd;
          const sql = " SELECT  ifnull((rates_now)*"+ itemrate +",0) as exrates FROM exchange_rates where countries_iso2='th' ";
          db.query(
            sql,
          (error, result) => {
            if (error) {
              console.log(' Error get GetExchangeReate : ' + error);
            } else {                             
                res.json({
                  data: result
                });
            }
          }
       );

      });
  }catch(error){
      console.log(error);
  }     
}

exports.QRcreateOrder  =  async (req, res , next) => { 
  try{
    //id, username, email, languages_id
      req.body.items.map(item =>{
 
        var id = item.id;
        var email = item.email;
        //if(id = ''){}
          //res.redirect("/payment.routes/manager-order");
            try{  
              //#insert into orders(customers_id, customers_name)values(5,'abc@mmail.com')
              sql = "insert into orders(customers_id, customers_name)values("+ id +",'"+ email +"')";
              db.query(
                  sql,
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(500).json({ error: error.message })                 
                  } else {                  
                              
                      console.log("Ok! Orders !");
                      try{
                          var vsql = "";
                          vsql += " insert into orders_products SELECT 0 as orders_products_id,orders.orders_id as orders_id  ";
                          vsql += " , customers_basket.products_id as products_id  ";
                          vsql += " , products.products_model as products_model  ";
                          vsql += " , products_description.products_name as products_name  ";
                          vsql += " , products.products_price as products_price  ";
                          vsql += " , customers_basket.final_price as final_price  ";
                          vsql += " , products.products_tax_class_id as products_tax  ";
                          vsql += " , customers_basket.customers_basket_quantity as products_quantity  ";
                          vsql += " , (customers_basket.customers_basket_quantity * 60) as orders_quantity_minute,(customers_basket.customers_basket_quantity * 3600) as  orders_quantity_secound ";
                          vsql += " FROM ((orders  ";
                          vsql += "   INNER JOIN customers_basket ON orders.customers_id = customers_basket.customers_id)  ";
                          vsql += "   INNER JOIN products ON customers_basket.products_id = products.products_id)  ";
                          vsql += "   INNER JOIN products_description ON products.products_id = products_description.products_id  ";
                          vsql += " WHERE (((products_description.languages_id)=1) AND ((orders.customers_id)="+ id +"))";                
                          console.log('create order product: ' + vsql);
                          db.query(vsql,(error,results) =>{
                              if (error) {
                                  console.log(error);
                                   res.status(500).json({ error: error.message }) 
                                  } else {
                                      //delete  FROM customers_basket where  customers_id=5
                                      db.query("delete  FROM customers_basket where  customers_id=?", id ,(error,resultss) =>{
                                          if (error) {
                                              console.log(error);
                                              } else {                                             
                                                  if(req.session.viewCount_basket){  
                                                    req.session.viewCount_basket = null;                                                                                                       
                                                  }             
                                                  console.log("ok ! delete");
                                              }
                                      }); 
                                      console.log("ok ! insert into order product");                                      
                                      res.json({ id: item.id, email: item.email })                       
                                  }
                          });

                      }catch(err){
                          //console.log(err);
                          res.status(500).json({ error: err.message }) 
                          //insert log
                      }
                  }
                }
              );
            }catch(err){
                //console.log(err);
                res.status(500).json({ error: err.message })   
            }                        
      });
  }catch(error){
      //console.log(error); 
      res.status(500).json({ error: error.message })        
  }     
}
