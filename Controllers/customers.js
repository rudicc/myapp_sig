const mysql = require("mysql");
const dotenv = require('dotenv');
const { json } = require("body-parser");
 

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
    console.log('Customes Not MySql connect !');
  }else{
    console.log("Customes Mysql connected... ");
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
        console.log('Customes Not MySql connect !' + error);
    }else{
        console.log("Customes Mysql connected...");
    }
});

function getTotal(id){
 try{
  var sql = " SELECT customers_basket_quantity as qun, final_price as pri, (customers_basket_quantity *final_price) as total FROM customers_basket  where customers_basket.customers_id =" + id;
    db.query(
      sql,
    (error, result) => {
      if (error) {
        console.log(error);
      } else {                                      
          return  result;
      }
    }
  );

 }catch(error){
  console.log(error);
 }
}


//Get Checkout
exports.GetCustomers_basket = async (req, res, next) => {
    try{
        const { id, username, email, languages_id } = req.session.SessionUser;  
        console.log(getTotal(id));
        var sql = "";
        sql += " SELECT (@cnt := @cnt + 1) AS rownumber, customers_basket.customers_basket_id,customers_basket.customers_id, customers_basket.products_id,products.products_model  ";
        sql += " , (customers_basket.customers_basket_quantity) as sum_customers_basket_quantity  ";
        sql += " , (customers_basket.final_price) as sum_final_price  ";
        sql += " , ((customers_basket.customers_basket_quantity)*(customers_basket.final_price)) as total_price  ";
        sql += ", '0' as sum_quantity_footer"
        sql += ", '0' as sum_price_footer , '0' as Total_basket"
        sql += " FROM customers_basket  ";
        sql += " inner join products on(products.products_id = customers_basket.products_id)  CROSS JOIN (SELECT @cnt := 0) AS dummy ";
        sql += " where customers_id=" + id;
        sql += " order by  products_id ,customers_id  ";
        //console.log('sql :'+ sql);
        db.query(
            sql,
           (error, result) => {
             if (error) {
               console.log(error);
             } else {                  
                req.userData = result           
                return next(); 
             }
           }
       );
     }catch(err){
        console.log(err);
        return next();
    }
    
}
//POS - Delete
exports.DelCustomers_basket = async (req, res, next) => {
    try{

        const { id, username, email, languages_id } = req.session.SessionUser;
        const { customers_basket_id, products_quantity, products_price , hour} = req.body;
        var sql = "";
        sql += "delete  FROM customers_basket where customers_id="+ id +" and customers_basket_id=" + customers_basket_id;
        db.query(
            sql,
           (error, result) => {
             if (error) {
               console.log(error);
             } else {                
                // db.query("SELECT ifnull(count(*),0) as counts FROM customers_basket where customers_id=?",id,(error,results) => {
                //     if(error){
                //         console.log(error);
                //     }else{
                //         req.session.viewCount_basket = results[0].counts;
                //         console.log(' Del req.session.viewCount_basket:' +  req.session.viewCount_basket)                        
                //     }
                // }); 
                if(req.session.viewCount_basket){
                    req.session.viewCount_basket = req.session.viewCount_basket - 1;
                }
               res.redirect("/checkout");
               next();
             }
           }
       ); 
    }catch(err){
        console.log(err);
        return next();
    }
}
//POST - insert
exports.Customers_basket = async (req, res, next) => {
    // <input type="hidden" id="products_id" name="products_id" value="{{products_id}}" />
    // <input type="hidden" id="products_quantity" name="products_quantity" value="{{products_quantity}}" />
    // <input type="hidden" id="products_price" name="products_price" value="{{products_price}}" /> 
    //insert into customers_basket(customers_id, products_id, customers_basket_quantity, final_price, customers_basket_date_added)values(1,1,1,0.660,now())
    try{
        const { id, username, email, languages_id } = req.session.SessionUser;
        const { products_id, products_quantity, products_price , hour} = req.body;
        console.log(email +' - '+ products_id +' - '+ products_quantity +' - '+ products_price + '-' + hour);

        var sql = "insert into customers_basket(customers_id, products_id, customers_basket_quantity, final_price, customers_basket_date_added)values(";
        sql += id;
        sql += "," + products_id;
        sql += "," + hour;
        sql += "," + products_price;
        sql += ", now()";    
        sql += ")";
        db.query(
             sql,
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                if(req.session.viewCount_basket){
                    req.session.viewCount_basket = req.session.viewCount_basket + 1;
                } else {
                    req.session.viewCount_basket = 1;
                }
                // var vc =0;
                // db.query("SELECT ifnull(count(*),0) as counts FROM customers_basket where customers_id=?",id,(error,results) => {
                //     if(error){
                //         console.log(error);
                //     }else{
                //         vc = results[0].counts; console.log('vc' + vc);
                       
                //     }
                // }); 

                console.log(' ---req.session.viewCount_basket:' +  req.session.viewCount_basket)
                res.redirect("/Products");
                next();
              }
            }
        );

    }catch(err){
        console.log('err: ' + err);
        next();
    }

    
}


//POST -Order -CompleteOrder
exports.CompleteOrder = async (req, res, next) => {
  try{
     const { id, username, email, languages_id } = req.session.SessionUser;
     console.log('complete order: ' + id);
     res.redirect('/Checkout');
     next();
  }catch(error){
    console.log(error);
    next();
  }
}


 
 
 
//MVC 
//exports.CompleteOrder = async (req, res, next) => {
exports.get_customers = async (req, res) => {
  
    try{
      const { id } = req.params;
      var sql = "";
      sql = " SELECT customers_id, customers_gender, customers_firstname, customers_lastname, customers_dob, customers_email_address, customers_default_address_id, customers_telephone, customers_fax, customers_newsletter, customers_country_id, customers_state_id, customers_address, customers_zip ";
      sql += " FROM customers where customers_id=" + id;
      console.log(sql);
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

 
exports.post_customers = async (req, res) => {
 
  // [
  //   {
  //     customers_id: '5',
  //     customers_email_address: '$abc@mmail.com',
  //     customers_default_address_id: 'd',
  //     customers_country_id: 'AS',
  //     customers_state_id: 'Pacific/Pago_Pago',
  //     customers_address: 'dd',
  //     customers_zip: '111'
  //   }
  // ]
  try{   
 //console.log(req.body.items);

    var sql = "";
    req.body.items.map(item => {
      console.log(item.customers_email_address);
      // vdata[0] = item.customers_gender ;
      // vdata[1] = item.customers_firstname ;
      // vdata[2] = item.customers_lastname ;
      // vdata[3] = item.customers_email_address ;
      // vdata[4] = item.customers_default_address_id ;
      // vdata[5] = item.customers_country_id ;
      // vdata[6] = item.customers_state_id ;
      // vdata[7] = item.customers_address ;
      // vdata[8] = item.customers_zip ;
      // vdata[9] = item.customers_id ;

      sql =" update customers set customers_gender='" + item.customers_gender +"'";
      sql += ",customers_firstname='" + item.customers_firstname +"'";
      sql += ",customers_lastname='" + item.customers_lastname +"'";
      sql += ",customers_email_address='" + item.customers_email_address +"'";
      sql += ",customers_default_address_id='" + item.customers_default_address_id +"'";
      sql += ",customers_country_id='" + item.customers_country_id +"'";
      sql += ",customers_state_id='" + item.customers_state_id +"'";
      sql += ",customers_address='" + item.customers_address +"'";
      sql += ",customers_zip='" + item.customers_zip +"'";
      sql += " where customers_id=" + item.customers_id; 

    });        
    console.log(sql);
    db.query(
      sql,
    (error, result) => {
      if (error) {
        console.log(' Erro get_customers : ' + error);
      } else {                             
          res.json({
            data: 'Success'
          });
      }
    }
 );
      
  }catch(error){
    console.log('Error get_customers : ' + error);    
  }
}


