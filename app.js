var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nodemailer = require("nodemailer");
const mongodb = require("mongodb");

//create the mongodb client
const MongoClient = mongodb.MongoClient;

const client = new MongoClient("mongodb+srv://cyclobold_user:e6b5eBt.$5PAcgx@cluster0.qcoqo.mongodb.net/?retryWrites=true&w=majority")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const registerRouter = require("./routes/register")
const loginRouter = require("./routes/login");






var app = express();

app.use(express.json());

//Email Setup
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "cycloboldtest@gmail.com",
    pass: "wqqsyclsiybxrveh"
  }
});

//Endpoints
app.post("/register-user", function(request, response){
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const email = request.body.email
    const password = request.body.password

    const email_link = `http://localhost:3000/verify_account?email=${email}&&key=1234`;

    //send email to this user
    const mailOptions =  {
      from: 'cycloboldtest@gmail.com',
      to: email,
      subject: `Activate Your Account`,
      html: `<body>
                  <h3>Congratulations.</h3>
                  <hr>
                  Your account has been created. Please verify by clicking the link 
                  below: <br>
                  <a target='_blank' href='${email_link}'>${email_link}</a>
          </body>`
    };

    transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
          console.log(error);
          throw error
        } else {
          console.log('Email sent: ' + info.response);

          //save to database
          const feedback = await client.db("broomsticks").collection("users").insertOne({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            key: 123,
            is_user_verified: false

          })
          
          if(feedback){
            //emai sent
            response.send("Email was sent to "+email)
          }
          
  
        
        }
  
  
    })
    
})

app.get("/verify_account", async function(request, response){

  //console.log(request.query);
  let email = request.query.email;
  let key = request.query.key;

  //check the database to see if the query data matches
  //check if email exists
  const feedback = await client.db("broomsticks").collection("users").findOne({'email': email})

  console.log(feedback);

  if(feedback != null){
    //the email exists
    //check the key
    console.log(feedback);

    if(feedback.key == key ){
      
      //check if this user has been verified already..
      const verified = await client.db("broomsticks").collection("users").findOne({"is_user_verified": true});
      if(verified){
        response.render("account-verified-already-status");
      }else{
          //if not verified
        const updateFeedback = await client.db("broomsticks").collection("users").updateOne({"email": email}, {$set: {"is_user_verified": true }})

        console.log(updateFeedback);
        if(updateFeedback){
          response.send("account-verified");
      }
      }

    



      
    
    }else{
      response.render("error", {
        message: "Your link is invalid",
        error: {
          stack: "The problem is the key",
          status: 402
        }
      });
    }

    
  }else{
    response.render("error", {
      message: "You link is invalid", 
      error: {
        stack: "The problem is the email",
        status: 402
      }
    });
  }


  

})





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
