const express = require('express')
const Path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan')
const bodyParser = require('body-parser')
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const DisplayRoute = require('./routes/DisplayRoute')
const CheckListRoute = require('./routes/CheckListRoute')
const ConnectionDb = require('./connection/database')

// // Middleware For Morgan
// if(process.env.NODE_ENV == 'Development'){app.use(morgan('tiny'))}

// MiddleWare For Assests Middleware
app.use(express.static(Path.resolve(__dirname, 'public')))

// Middleware For BodyParser
app.use(express.urlencoded({extended : false}))
app.use(bodyParser.json())

// Middleware Express Ejs Layouts
app.set("view engine", "ejs");
app.use(expressLayouts);

// Middleware For Session
app.use(session({secret: 'checklist', resave: false, saveUninitialized: false}))

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Flash MiddleWare
app.use(flash())

// Global Variables(MiddleWare For Flash Messages)
app.use( (request,response,next) => {
response.locals.success_msg = request.flash('success_msg')
response.locals.error_msg = request.flash('error_msg')
response.locals.error = request.flash('error')
next()})

// Middleware For Routes
app.use('/checklist',DisplayRoute)
app.use('/checklist',CheckListRoute)

// Start Connection


const StartConnection = async () => {
try {
    await ConnectionDb(process.env.MONGO_URI);
    console.log("Database Connected");
    app.listen(PORT, () => console.log(`App dashing on port ${PORT} on a ${process.env.NODE_ENV} environment`))
} catch (error) {
    console.log('error')
}
}
StartConnection()