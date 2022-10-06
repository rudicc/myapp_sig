const mysql = require("mysql");

class DBcommandmysql {
    constructor(config) {
        this.connection = mysql.createConnection( config );
        console.log('DBcommandmysql: ' + this.connection );
    }
  
        query(sql , args){
            return new Promise(( resolve , reject ) =>{
                this.connection.query( sql , args , (err , rows ) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve( rows );
                });
            });
        }

        close() {
            return new Promise(( resolve , reject ) =>{
                this.connection.end( err => {
                    if( err ) {
                        return reject( err );
                    }
                });
            });
        }        
 
}
module.exports = DBcommandmysql;