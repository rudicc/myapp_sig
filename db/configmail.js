const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});

module.exports ={
    MAIL_USER:  process.env.MAIL_USER,
    MAIL_CLIENT_ID:  process.env.MAIL_CLIENT_ID,
    MAIL_CLIENT_SECRET:  process.env.MAIL_CLIENT_SECRET,
    MAIL_REDIRECT_URL:  process.env.MAIL_REDIRECT_URL,
    MAIL_REFRESH_TOKEN:  process.env.MAIL_REFRESH_TOKEN,
}
