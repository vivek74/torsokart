var express     = require("express"),
    app         = express(),
    aws = require('aws-sdk'),
    bodyParser  = require("body-parser"),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    mongoose    = require("mongoose"),
    usePushEach = true,
    multer=require('multer'),
    path= require('path'),
    ejs= require('ejs'),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    shortid = require('shortid'),
    Category1=require("./models/category1"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    methodOverride = require("method-override"),
    MongoStore = require("connect-mongo")(session),
    Cart = require("./models/cart"),
    request = require('request');

    aws.config.update({
        secretAccessKey: 'All3KDxcLmkaLm1R+DKr4MmdecJThOv0DqbrrHw9',
        accessKeyId: 'AKIAJOQE45PB6ZPLRSKQ'
    });

    var s3 = new aws.S3();


// configure dotenv
require('dotenv').load();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    categoryRoutes       =require("./routes/category"),
    indexRoutes      = require("./routes/index"),
    dashbordRoutes   =require("./routes/dashbord");

mongoose.connect("mongodb://torsokart:Vash12345@ds131258.mlab.com:31258/torsokart",{ useMongoClient: true });    
//mongoose.connect("mongodb://localhost/yelp_camp_profiles",{ useMongoClient: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("database conected!");
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/.well-known"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "team4",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie:{ maxAge: 60 * 60 * 1000 * 24 * 30 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.session = req.session;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/category", categoryRoutes);
//commentroutes
app.use("/category/:category/:id/comments", commentRoutes);
app.use("/dashbord", dashbordRoutes);

// app.listen(8000, function(){
//    console.log("server started at 8000");
// });

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server started");
});
 
