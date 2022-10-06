
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
    console.log('Product Not MySql connect !');
  }else{
    console.log("Product Mysql connected... ");
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
        console.log('Product Not MySql connect !' + error);
    }else{
        console.log("Product Mysql connected...");
    }
});
 

//Product
exports.Products = async (req, res, next) => {
    //console.log("product body: " + req.body);
    // <input type="hidden" id="userid" name="userid" value="{{user.id}}" />
    // <input type="hidden" id="username" name="username" value="{{user.username}}" />
    // <input type="hidden" id="email" name="email" value="{{user.email}}" />
    // <input type="hidden" id="languages_id" name="languages_id" value="{{user.languages_id}}" />      

    try{ 
        const { id, username, email, languages_id } = req.session.SessionUser;
        console.log('languages_id: ' + languages_id);
 
      var sql = "";
      sql += " SELECT ";
      sql += " products_to_categories.categories_id, categories_description.categories_name  , languages.languages_id , products.*, products_description.* ";
      sql += ",(SELECT count(*) as vcn  FROM  customers_basket where customers_id=5)as vcount"
      sql += " FROM ((((categories INNER JOIN categories_description ON categories.categories_id = categories_description.categories_id)  ";      
      sql += " INNER JOIN products_to_categories ON categories.categories_id = products_to_categories.categories_id)  ";
      sql += " INNER JOIN products ON products_to_categories.products_id = products.products_id)  ";
      sql += " INNER JOIN products_description ON products.products_id = products_description.products_id)  ";
      sql += " INNER JOIN languages ON (languages.languages_id = categories_description.languages_id) AND (products_description.languages_id = languages.languages_id) ";
      sql += " WHERE ( ";
      sql += " 	((products.products_status)="+ 1 +") ";
      //sql += " and	((languages.languages_id)="+ languages_id +") ";
      sql += " ) ";
      //console.log("vsql: " + sql);
      db.query(sql,(err,results) => {
          //console.log('product:' + results);
          if(!results){
            return next();
          }
          req.userData = results;
          return next();         
        }
      );
    }catch(error){
      console.log('product err: ' + error);
      next();
    }
  }; 

  exports.ProductsJson = async (req, res, next) => {
    //console.log("product body: " + req.body);
    // <input type="hidden" id="userid" name="userid" value="{{user.id}}" />
    // <input type="hidden" id="username" name="username" value="{{user.username}}" />
    // <input type="hidden" id="email" name="email" value="{{user.email}}" />
    // <input type="hidden" id="languages_id" name="languages_id" value="{{user.languages_id}}" />      

    try{ 
        const { id, username, email, languages_id } = req.session.SessionUser;
        console.log('languages_id: ' + languages_id);

       
      var sql = "";
      sql += " SELECT ";
      sql += " products_to_categories.categories_id, categories_description.categories_name  , languages.languages_id , products.*, products_description.* ";
      sql += " FROM ((((categories INNER JOIN categories_description ON categories.categories_id = categories_description.categories_id)  ";
      sql += " INNER JOIN products_to_categories ON categories.categories_id = products_to_categories.categories_id)  ";
      sql += " INNER JOIN products ON products_to_categories.products_id = products.products_id)  ";
      sql += " INNER JOIN products_description ON products.products_id = products_description.products_id)  ";
      sql += " INNER JOIN languages ON (languages.languages_id = categories_description.languages_id) AND (products_description.languages_id = languages.languages_id) ";
      sql += " WHERE ( ";
      sql += " 	((languages.languages_id)=1) ";
      sql += " ) ";
      //console.log("vsql: " + sql);
      db.query(sql,(err,results) => {
          console.log('product:' + results);
          if(!results){
            return next();
          }
       var j =   res.json({
            results:results
          });   
          console.log(j)  ;
          return next();         
        }
      );
    }catch(error){
      console.log('product err: ' + error);
      next();
    }
  }; 