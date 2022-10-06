const mysql = require("mysql");
const dotenv = require('dotenv');
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

db.connect((error) =>{
    if(error){
        console.log('api Not MySql connect !' + error);
    }else{
        console.log("api Mysql connected...");
    }
});


//Re json
//GET customer basket  
exports.customer_basket = async (req, res) => {

    try{  
      const { id }  = req.params;
      sql = " SELECT   (@cnt := @cnt + 1) AS rownumber ";
      sql += "   , customers_basket.customers_basket_id   ";
      sql += "   , customers_basket.customers_id   ";
      sql += "   , customers_basket.products_id   ";
      sql += "   , customers_basket.customers_basket_quantity   ";
      sql += "   , customers_basket.final_price   ";
      sql += "   , customers_basket.customers_basket_date_added   ";
      sql += "   , customers_basket.payment_image   ";
      sql += "   , (customers_basket_quantity * final_price) as total   ";
      sql += "   , products.products_model   ";
      sql += "   FROM customers_basket   ";
      sql += "    inner join products on(products.products_id=customers_basket.products_id)    CROSS JOIN (SELECT @cnt := 0) AS dummy";
      sql += "   where customers_basket.customers_id = " + id; 

      //console.log(sql);
      db.query(
        sql,
      (error, result) => {
        if (error) {
          console.log(' Erro get_customers : ' + error);
        } else {                             
            res.json({
              data:result
            });
        }
      }
   );
      
           
       }catch(error){
         console.log('Error get_customers : ' + error);    
       }
}