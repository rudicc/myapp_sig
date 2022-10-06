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

 


//SELECT id, tb_input, tb_convert_input, tb_group, tb_output, tb_convert_output, products_id, active FROM data_brain where active=1 and products_id=1
exports.Data_OutputBrain = async (req, res) => {
    try{
        //SELECT tb_input, tb_group FROM data_brain where active=1 and products_id=1
        req.body.items.map(item =>{
 
            var sql  = "SELECT id, tb_input, tb_convert_input, tb_group, tb_output, tb_convert_output, products_id, youtue_id  FROM data_brain where active=1 and products_id=" + item.products_id;
            sql += " order by tb_group";
            db.query(sql,(error,result)=>{
                if(error){
                    console.log(error);
                    return res.json({
                        data : 'error ' + error
                    });
                }else{
                    return res.json({ data:result});
                }
            });    
        });         
    }catch(error){
        return res.json({
            data : 'error ' + error
        });
    }
}

//net brain
exports.DataNetBrain = async (req, res) => {
    try{
        //SELECT tb_input, tb_group FROM data_brain where active=1 and products_id=1        
        req.body.items.map(item =>{
 
            var tb_input = item.message.replace("'","|");
            var sql  = "SELECT id, tb_input, tb_convert_input, tb_group, tb_output, tb_convert_output, products_id ";
            sql += " FROM data_brain where active=1 and products_id=" + item.products_id;
            sql += " and tb_input like '" + tb_input + "%' ";
            sql += "  order by tb_group";
            console.log(sql);
            db.query(sql,(error,result)=>{
                if(error){
                    console.log(error);
                    return res.json({
                        data: 'error' + error
                    });
                }else{
                    return res.json({ data:result});
                }
            });    
        });         
    }catch(error){
        return res.json({
            data: 'error' + error
        });
    }
}