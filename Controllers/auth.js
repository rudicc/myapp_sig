
const mysql = require("mysql");
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const configmail = require('../db/configmail');
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(configmail.MAIL_CLIENT_ID, configmail.MAIL_CLIENT_SECRET);
OAuth2_client.setCredentials({
  refresh_token : configmail.MAIL_REFRESH_TOKEN
})


const newDate = new Date();
var myDB = require('../db/class_dbcommand');
const { text } = require("body-parser");

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

/*** 
 * 

let db = new  myDB(config);
if(db.connection){
    console.log('Auth Not MySql connect !' + process.env.DATABASE_HOST);
  }else{
    console.log("Auth Mysql connected... ");
}
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
        console.log('Auth Not MySql connect !' + error);
    }else{
        console.log("Auth Mysql connected...");
    }
});

exports.SignIn = async (req, res) => {
    try {
      const { txtEmail, txtPassword } = req.body;
      console.log(txtEmail  + '' + txtPassword);
      if (!txtEmail || !txtPassword) {
        return res.status(400).render("signin", {
          msg: "Please Enter Your Email and Password",
          msg_type: "error",
        });
      }
  
      db.query(
        "select * from users where email=?",
        txtEmail,
        async (error, result) => {
          console.log('signin:' + result);
          if (result.length <= 0) {
            return res.status(401).render("signin", {
              msg: "Please Enter Your Email and Password",
              msg_type: "error",
            });
          } else {
            if (!(await bcrypt.compare(txtPassword, result[0].password))) {
              return res.status(401).render("signin", {
                msg: "Please Enter Your Email and Password",
                msg_type: "error",
              });
            } else {
              //res.send("Good");
              const id = result[0].id;
              const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
              console.log("The Token is :" + token);

              req.session.SessionUser = result[0];
              const cookieOptions = {
                expires: new Date(
                   Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ), httpOnly: true,
              };

              try{                                                                 
                res.cookie('MySIGVENG',token, cookieOptions);                
                res.status(200).redirect("/");   
              }catch(err){

                console.log(err);
              }         
              console.log(cookieOptions);                             
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
 

exports.Registers = (req, res) => {
    console.log(req.body); 
    const { txtUsername, txtEmail, txtPassword, txtConfirm_password } = req.body;
    db.query(
      "select email from users where email=?",
      [txtEmail],
      async (error, result) => {
        if (error) {
          confirm.log(error);
          return res.render("registers", {
            msg: "Email id already Taken",
            msg_type: "error",
          });
        }
     
        if (result.length > 0) {
          return res.render("registers", {
            msg: "Email id already Taken",
            msg_type: "error",
          });
        } else if (txtPassword !== txtConfirm_password) {
          return res.render("registers", {
            msg: "Password do not match",
            msg_type: "error",
          });
        }
        var reciptent = txtEmail;
        var name = txtUsername;
        const accessToken = OAuth2_client.getAccessToken();
        const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  type:  'OAuth2',
                  user: configmail.MAIL_USER,
                  clientId: configmail.MAIL_CLIENT_ID,
                  clientSecret: configmail.MAIL_CLIENT_SECRET,
                  refreshToken: configmail.MAIL_REFRESH_TOKEN,
                  accessToken: accessToken,
            }
        })
        const mail_optons ={
                from: `SIG English. <${configmail.MAIL_USER}>`,
                to: reciptent,
                subject: 'hello! Welcome to SIG english learning.',
                text: 'Sig English - AI Speech.',
                html: get_html_message(name),
        }
                     
        let hashedPassword = await bcrypt.hash(txtPassword, 8);
        transport.sendMail(mail_optons, function(error, result) {
          if(error){       
            console.log('Error : ', error);
               return res.render("registers", {
                  msg: "Your email is invalid. Please check!" + error ,
                  msg_type: "error",
                });
          }else{          
              console.log('Success: ', result);        
 
              //SaveUser(txtUsername , txtEmail , hashedPassword , newDate);
              try{
                //console.log(hashedPassword);                          
                db.query(
                 "insert into users set ?",
                 { username: txtUsername, email: txtEmail, password: hashedPassword , create_date: newDate},
                 (error, result) => {
                   if (error) {
                     console.log(error);
                   } else {
                     //console.log(result);
                
                        var sql = "insert into customers  SELECT id as customers_id, '0' as customers_gender, '' as customers_firstname, '' as customers_lastname, now() as  customers_dob, email as customers_email_address, '0' as customers_default_address_id, '' as customers_telephone, '' as customers_fax, '0' as customers_newsletter, '' as customers_country_id, '' as customers_state_id, '' as customers_address, '' as customers_zip  FROM users ";
                         sql += " where email='"+ txtEmail +"'  ";
                         sql += " and username='" + txtUsername + "'  ";
                         sql += " and password='"+ hashedPassword +"' ";
       
                         console.log('customers: ' + sql);
                         db.query(sql,(error,result) =>{
                           if(error){console.log('Errror registers to customers : ' + error);}
                         });
       
                     return res.render("registers", {
                       msg: "User Registration Success. Go to Signin",
                       msg_type: "good",                                  
                     });
                   }
                 }
               );
         }catch(error){
           console.log(error);
         }
   
          }
          transport.close();
        })    
      }
    );
  };

  //isLoggedIn
  exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.MySIGVENG){
      console.log('Yes! : ' + req.cookies.MySIGVENG);
      const decode = await promisify(jwt.verify)(
        req.cookies.MySIGVENG,process.env.JWT_SECRET
      );
      console.log(decode);
      try{
        db.query(
          "SELECT users.*, '' as languages_name FROM  users where users.id=?",[decode.id],(err,results) => {
            console.log(results);
            if(!results){
              return next();
            }
            req.user = results[0]; 
            return next();
          }
        );
      }catch(error){
        console.log(error);
        return next();
      }
    }else{
      next();
    }
  };


//Accounts
exports.Accounts = (req, res) => {
    console.log(req.body);
    res.send("From submintted Accounts");
};

//Logout
exports.Logout = (req, res) => {
  res.cookie("MySIGVENG" , "Logout", {
    expires: new Date(
      Date.now() + 2 * 1000
   ), httpOnly: true,
  });
  req.session.destroy();
  res.status(200).redirect("/signin");
   
};


//

// const _mailcheck = 'NO';
// function send_mail(name , reciptent){

//   const accessToken = OAuth2_client.getAccessToken();
//   const transport = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             type:  'OAuth2',
//             user: configmail.user,
//             clientId: configmail.MAIL_CLIENT_ID,
//             clientSecret: configmail.MAIL_CLIENT_SECRET,
//             refreshToken: configmail.MAIL_REFRESH_TOKEN,
//             accessToken: accessToken,
//       }
//   })
//   const mail_optons ={
//           from: `SIG English. <${configmail.user}>`,
//           to: reciptent,
//           subject: 'hello! Welcome to SIG english learning.',
//           text: 'Sig English - AI Speech.',
//           html: get_html_message(name),
//   }
//   transport.sendMail(mail_optons, function(error, result) {
//     if(error){       
//       console.log('Error : ', error);
//       transport.close(); 
//       _mailcheck = 'NO';
//     }else{
    
//       console.log('Success: ', result);
//       transport.close(); 
//       _mailcheck = 'OK';
//     }
//     transport.close();
//   })
//   return _mailcheck;
// }

function get_html_message(name)
{
  var html = "";

  try{
    db.query(
      "SELECT vhtml FROM data_frommail where vtype=1",(err,result) => {
        console.log(result);
        if(!result){
          return next();
        }
        html = result[0].vhtml;        
      }
    );
  }catch(error){
    console.log(error);
  }

var v1 = ` <h1>Dear. ${name} </h1> `;
  return v1 + html ;
}

//send_mail('Hi Sig .. ','sigveng.solution@gmail.com');