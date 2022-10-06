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



exports.GetorderProduct = async (req, res) => {
  const { id } = req.params; 
  console.log(id);
  try{
      //id=5;
     var sql = "";
     sql = " SELECT orders_products.products_id, orders.orders_id ";
     sql += " , orders_products.orders_products_id ";
     sql += " , orders.customers_id, orders_products.products_model ";
     sql += " , orders_products.products_name, orders_products.products_price ";
     sql += " , orders_products.final_price, orders_products.products_quantity "; 
     sql += " ,orders_products.orders_quantity_minute ";
     sql += " ,orders_products.orders_quantity_second ";
     //sql += " ,concat(orders_products.products_id , '#', orders.orders_id , '#' , orders_products.orders_products_id , '#' , orders.customers_id )as pid ";
     sql += " FROM orders INNER JOIN orders_products ON orders.orders_id = orders_products.orders_id ";
     sql += " WHERE (((orders.customers_id)="+ id +") and ((orders_products.orders_quantity_second)<>0)) ";
     sql += " ORDER BY orders_products.products_id, orders.orders_id, orders_products.orders_products_id ";
     //console.log('sql:getorder-product: ' +sql);

     sql = "SELECT * FROM `orders_products`";
     db.query(
         sql,
       (error, result) => {
         if (error) {
           console.log(' Erro Query getorder product: ' + error);
         } else { 
                 //console.log('data: ' + result) ;                        
             res.json({
               data:result
             });
         }
       }
    );
 
   }catch(err){
     console.log(err);
   }
}

exports.GetContents = async (req, res) => {
  const { id } = req.params; 
  //console.log(id);
  try{
      //id=5;
     var sql = "";    
     sql ="SELECT concat(products_id,'#', contents_id,'#', sort) as conpid  , products_id, contents_id, sort, contents_type, contents_name, active FROM contents where active=1 and products_id="+ id +"  order by sort";     
     db.query(
         sql,
       (error, result) => {
         if (error) {
           console.log(' Erro Query getorder product: ' + error);
         } else { 
                 //console.log('data: ' + result) ;                        
             res.json({
               data:result
             });
         }
       }
    );
 
   }catch(err){
     console.log(err);
   }
}

exports.GetContent_SubDetail = async (req, res) => {
    const { id } = req.params; 
    console.log(id);
    var mylist = [];

    try{
          mylist = id.split(',');
        //id=5;
       var sql = "";
       sql = " SELECT ";
       sql += "       contents.contents_id ";
       sql += "     , contents.products_id ";
       sql += "     , contents.contents_type ";
       sql += "     , contents.contents_name ";
       sql += "     , contents_subdetail.subid ";
       sql += "     , contents_subdetail.sort_scription ";
       sql += "     , contents_subdetail.subscription ";
       sql += "     , contents_subdetail.subscription_ans ";
       sql += "     , contents_subdetail.sub_keyword ";
       sql += "     , contents_subdetail.images_path1 ";
       sql += "     , contents_subdetail.images_path2 ";
       sql += "     , contents_subdetail.images_path3 ";
       sql += "     , contents_subdetail.images_path4 ";
       sql += "     , contents_subdetail.images_path5 ";
       sql += "     , contents_subdetail.translate ";
       sql += " FROM ";
       sql += "     sigeng.contents ";
       sql += "     INNER JOIN sigeng.contents_subdetail  ";
       sql += "         ON (contents.products_id = contents_subdetail.products_id AND contents.contents_id = contents_subdetail.contents_id) ";
       sql += " WHERE ( ";
       sql += " 		contents_subdetail.products_id = "      + mylist[0];
       sql += " 		AND contents_subdetail.contents_id = " +  mylist[1];
       sql += " 		AND contents.active =1 ";
       sql += " 	) ";
       sql += " ORDER BY contents.contents_id ASC, contents.products_id ASC, contents.sort ASC, contents_subdetail.subid ASC, contents_subdetail.sort_scription ASC   ";
       
       db.query(
           sql,
         (error, result) => {
           if (error) {
             console.log(' Erro Query getorder product: ' + error);
           } else { 
                   //console.log('data: ' + result) ;                        
               res.json({
                 data:result
               });
           }
         }
      );
   
     }catch(err){
       console.log(err);
     }
}

//Guides
exports.GetGuidesProduct = async (req, res) => {
  const { id } = req.params; 
  try{
     var sql = "SELECT * FROM `guides` order by id";      
     db.query(
         sql,
       (error, result) => {
         if (error) {
           console.log(' Erro Query Get Guides Product: ' + error);
         } else {                             
             res.json({
               data:result
             });
         }
       }
    );
 
   }catch(err){
     console.log(err);
   }
}

//GetProducts
exports.GetProducts = async (req, res) => {
  const { id } = req.params; 
  try{
    var sql = "";
    sql += " SELECT ";
    sql += " products_to_categories.categories_id, categories_description.categories_name  , languages.languages_id , products.*, products_description.* ";
    sql += ",(SELECT count(*) as vcn  FROM  customers_basket where customers_id=5)as vcount"
    sql += " FROM ((((categories INNER JOIN categories_description ON categories.categories_id = categories_description.categories_id)  ";      
    sql += "  INNER JOIN products_to_categories ON categories.categories_id = products_to_categories.categories_id)  ";
    sql += "  INNER JOIN products ON products_to_categories.products_id = products.products_id)  ";
    sql += "  INNER JOIN products_description ON products.products_id = products_description.products_id)  ";
    sql += "  INNER JOIN languages ON (languages.languages_id = categories_description.languages_id) AND (products_description.languages_id = languages.languages_id) ";
    sql += " WHERE products.products_status=1 "; 
     db.query(
         sql,
       (error, result) => {
         if (error) {
           console.log(' Erro Query Get Products : ' + error);
         } else {                             
             res.json({
               data:result
             });
         }
       }
    );
 
   }catch(err){
     console.log(err);
   }
}

