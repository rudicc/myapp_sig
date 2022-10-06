//import axios from "axios";
const axios= require('axios');
const mysql = require("mysql");
const dotenv = require('dotenv');

const newDate = new Date();
var myDB = require('../db/class_dbcommand');

dotenv.config({
    path: './.env'
});

let config = {
    host     : process.env.DATABASE_HOST,
    port     : process.env.DATABASE_PORT,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME

};
/**
 * let db = new  myDB(config);
if(db.connection){
    console.log('Expressions Not MySql connect !');
  }else{
    console.log("Expressions Mysql connected... ");
}
 * 
 */
const db = mysql.createConnection({
    host     : process.env.DATABASE_HOST, 
    port     : process.env.DATABASE_PORT,
    user     : process.env.DATABASE_USER, 
    password : process.env.DATABASE_PASSWORD, 
    database : process.env.DATABASE_NAME
});

db.connect((error) =>{
    if(error){
        console.log('Expressions Not MySql connect !' + error);
    }else{
        console.log("Expressions Mysql connected...");
    }
});

exports.ExpressionsOrder = async (req, res , next) => {
    const { id, username, email, languages_id } = req.session.SessionUser;  
next();
}

exports.GetOrderProduct = async (req, res , next) =>{
    const { id } = req.params;
    console.log(id);
    try{
       
      var sql = "";
      sql = " SELECT orders_products.products_id, orders.orders_id ";
      sql += " , orders_products.orders_products_id ";
      sql += " , orders.customers_id, orders_products.products_model ";
      sql += " , orders_products.products_name, orders_products.products_price ";
      sql += " , orders_products.final_price, orders_products.products_quantity ";
      sql += " , (orders_products.products_quantity* 60) as total_minute ";
      sql += " , (orders_products.products_quantity* 3600) as  total_second ";
      sql += " ,orders_quantity_minute ";
      sql += " ,orders_quantity_second ";
      sql += " FROM orders INNER JOIN orders_products ON orders.orders_id = orders_products.orders_id ";
      sql += " WHERE (((orders.customers_id)="+ id +")) ";
      sql += " ORDER BY orders_products.products_id, orders.orders_id, orders_products.orders_products_id ";
      db.query(
          sql,
        (error, result) => {
          if (error) {
            console.log(error);
          } else {                                 
            return  res.json({
                data:result
              });
            next(); 
          }
        }
     );
  
    }catch(err){
      console.log(err);
    }
    next();
  }

 
