require("dotenv").config(); //bring in the dotenv configuration


//Configure the Authentication Params
const authConfig = {
    authRequired: process.env.AUTH_REQUIRED,
    auth0Logout: process.env.AUTH0_LOGOUT,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    secret: process.env.SECRET 
}

const databaseConfig = {
    uri: "mongodb+srv://cyclobold_user:e6b5eBt.$5PAcgx@cluster0.qcoqo.mongodb.net/?retryWrites=true&w=majority",
    dbname: "broomsticks"
}


const mailConfig = {
    service: "gmail",
    user: "cycloboldtest@gmail.com",
    password: "nnjfgdzlgbpwwqjo"
}


module.exports = { authConfig, databaseConfig, mailConfig }
