var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Category1=require("../models/category1");
var async = require("async");
const nodemailer=require('nodemailer');
var crypto = require("crypto");
var Order = require("../models/order");
var Cart = require("../models/cart");
var middleware = require("../middleware");
var request = require('request');
var Address=require("../models/address");
var Banner = require("../models/banner");

//root route

router.get("/", function(req, res){
  
  var pageNumber = 1;
  var nPerPage = 4;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  //var x = showMore(total);
  Category1.find({}).limit(total).exec(function(err, allitems){
    if(err){
      console.log(err);
    } else {
      showMore(total);
      function showMore(total = 4){
        Category1.aggregate([{'$sample':{"size": total}}], function(err,showItems){
          Category1.aggregate([{'$match':{"category":"newArrival"}}, {'$sample':{"size": total}}],function(err,showtextitem){
            Category1.aggregate([{ $sort : { cost : 1 } }, { $limit : total }],function(err,showbestdeals){
              Category1.aggregate([{'$match':{"category":"trending"}}, {'$sample':{"size": total}}],function(err,showTrending){
                res.render("new-landing", {showItems: showItems, current: pageNumber, allitems:allitems, showtextitem:showtextitem, showbestdeals:showbestdeals, showTrending:showTrending});
              });
            });
          });
        });
      }
    }
  });
});

//all product from landing page
router.get("/allproduct/:page", function(req, res){
  // console.log(req.params.page);
  var pageNumber = req.params.page || 1;
  var nPerPage = 4;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  //var x = showMore(total);
  Category1.find({"category": req.params.category}, function(err, allitems){
    if(err){
      console.log(err);
    } else {
      showMore(total);

      //function 1
      function showMore(){
        // Category1.find({"category":"quotes"}).limit(total).exec(function(err, showItems){
        //   res.render("new-landing", {showItems: showItems});
        // });
        Category1.aggregate([{'$sample':{"size": total}}], function(err,showItems){
          res.render("ajax/allShirts", {showItems: showItems, current: pageNumber});
        });
      }
      //function 2

    }
  });
});

//trending
router.get("/trending/:page", function(req, res){
  
  var pageNumber = req.params.page || 1;
  var nPerPage = 4;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  Category1.find({}).limit(total).exec(function(err, allitems){
    if(err){
      console.log(err);
    } else {
      showMore(total);
      //function 1
      function showMore(){
        Category1.aggregate([{'$match':{"category":"trending"}},{'$sample':{"size": total}}], function(err,showTrending){
          res.render("ajax/trending", {showTrending: showTrending, current: pageNumber, allitems: allitems});
        });
      }
    }
  });
});

//TEXT LANDING PAGE

router.get("/text/:page", function(req, res){
  
  var pageNumber = req.params.page || 1;
  var nPerPage = 4;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  Category1.find({}).limit(total).exec(function(err, allitems){
    if(err){
      console.log(err);
    } else {
      showMore(total);
      //function 1
      function showMore(){
        Category1.aggregate([{'$match':{"category":"newArrival"}}, {'$sample':{"size": total}}],function(err,showtextitem){
          res.render("ajax/text", {showtextitem: showtextitem, current: pageNumber, allitems: allitems});
        });
      }
    }
  });
});

//best deals

router.get("/best-deals/:page", function(req, res){
  
  var pageNumber = req.params.page || 1;
  var nPerPage = 4;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  Category1.find({}).limit(total).exec(function(err, allitems){
    if(err){
      console.log(err);
    } else {
      showMore(total);
      //function 1
      function showMore(){
        Category1.aggregate([{ $sort : { cost : 1 } }, { $limit : total }],function(err,showbestdeals){
          res.render("ajax/bestDeals", {showbestdeals: showbestdeals, current: pageNumber, allitems: allitems});
        });
      }
    }
  });
});

// load more 

router.get("/page/:category/:page", function(req, res){
  // console.log(req.params.category);
  // console.log(req.params.page);
  var showCategories = req.params.category;
  var pageNumber = req.params.page || 1;
  var nPerPage = 12;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all category from DB
      Category1.find({name: regex}, function(err, allCategories){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allCategories);
         }
      });
  } else {
      // Get all category from DB
      if (req.params.category == 'allproducts') {
        showMore(total);
        function showMore(){
          Category1.find({}).limit(total).exec(function(err, allCategories){
            Category1.count().exec(function(err,count){
              if(err){
                console.log(err);
              } else {
                res.render("ajax/mainLoad",{category: allCategories, page: 'category', current: pageNumber, pages: Math.ceil(count / nPerPage), showCategories:showCategories});
              }
            })  
          });
        }
      } else{
          showMore(total);
          function showMore(){
            Category1.find({"category":req.params.category}).limit(total).exec(function(err, allCategories){
              Category1.find({"category":req.params.category}).count().exec(function(err,count){
                if(err){
                   console.log(err);
               } else {
                res.render("ajax/mainLoad",{category: allCategories, page: 'category', current: pageNumber, pages: Math.ceil(count / nPerPage), showCategories:showCategories});
               }
              })  
            });
          }
      }  
    }
});

//starting page

router.get("/StartingPage/:category/:page", function(req, res){
  // console.log(req.params.category);
  // console.log(req.params.page);
  var showCategories = req.params.category;
  var pageNumber = req.params.page || 1;
  var nPerPage = 12;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all category from DB
      Category1.find({name: regex}, function(err, allCategories){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allCategories);
         }
      });
  } else {
      // Get all category from DB
      if (req.params.category == 'allproducts') {
        showMore(total);
        function showMore(){
          Category1.find({}).limit(total).exec(function(err, allCategories){
            Category1.count().exec(function(err,count){
              if(err){
                console.log(err);
              } else {
                res.render("ajax/frontPage",{category: allCategories, page: 'category', current: pageNumber, pages: Math.ceil(count / nPerPage), showCategories:showCategories});
              }
            })  
          });
        }
      } else{
          showMore(total);
          function showMore(){
            Category1.find({"category":req.params.category}).limit(total).exec(function(err, allCategories){
              Category1.find({"category":req.params.category}).count().exec(function(err,count){
                if(err){
                   console.log(err);
               } else {
                res.render("ajax/frontPage",{category: allCategories, page: 'category', current: pageNumber, pages: Math.ceil(count / nPerPage), showCategories:showCategories});
               }
              })  
            });
          }
      }  
    }
});


//end of lading page
// add to cart

router.post("/add-to-cart/:id",function(req, res, next){
  var size = req.body.size;
  var productId = req.params.id;
  var cart= new Cart(req.session.cart ? req.session.cart : {}, size);

  Category1.findById(productId, function(err, product){
    if(err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.render("ajax/cartCount")
  });
});

//minus to cart

router.get("/reduce/:id", function(req, res, next){
  var productId = req.params.id;
  var cart= new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("back");
});

//plus to cart

router.get("/increase/:id", function(req, res, next){
  var productId = req.params.id;
  var cart= new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect("back");
});

//remove from cart

router.get("/remove/:id", function(req, res, next){
  var productId = req.params.id;
  var cart= new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("back");
});

//shopping cart

router.get("/cart", function(req, res, next){
  Category1.find({}, function(err,allCategories){
    if(err){
      console.log(err);
    } else{
      if(!req.session.cart) {
        return res.render("cart",{products: null});
      }
      var cart=new Cart(req.session.cart);
      res.render("cart",{category: allCategories, products: cart.generateArray(), totalCost: cart.totalCost, totalOrgCost: cart.totalOrgCost});
    }
  });
});

//checkout
router.get("/checkout",middleware.isLoggedIn, function(req, res){
  //console.log(req.session.cart.totalQty);
  if(!req.session.cart || req.session.cart.totalQty===0){
    return res.redirect("/cart");
  }
  User.findById(req.user.id).populate("addresses").exec(function(err, foundUser){
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    var cart=new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    if(req.user.firstUser === "false" ){
      if(req.body.appliedPromo === 'get50') {
        var promoStatus = "Promo code applied";
      } else if(req.body.appliedPromo == "") {
        var promoStatus = '';
      } else {
        var promoStatus = "";
      }
    } else {
      if(req.body.appliedPromo === 'get50'){
        var promoStatus = "Already applied";
      } else if(req.body.appliedPromo == "") {
        var promoStatus = '';
      } else {
        var promoStatus = "";
      }
    }
  res.render("checkout",{products: cart.generateArray(), total: cart.totalCost, errMsg: errMsg, noError: !errMsg, foundUser: foundUser ,promoStatus: promoStatus});
  });
  
});

//update order address
router.put("/checkout/update/:id",middleware.isLoggedIn,function(req,res){
    Address.findById(req.body.ch_address.add_id, function(err, foundAdd){
      res.render("ajax/address",{foundAdd:foundAdd})
      res.end();
    })

});

//add address
router.post("/checkout/add/:id",middleware.isLoggedIn,function(req,res){
  var add_firstName = req.body.ch_address.firstName.toUpperCase();
  var add_lastName =  req.body.ch_address.lastName.toUpperCase();
  var add_hostalNo =  req.body.ch_address.hostalno.toUpperCase();
  var add_roomNo =    req.body.ch_address.roomno;
  var add_phoneNo = req.body.ch_address.phoneNo;
  var newData = {firstName: add_firstName, lastName: add_lastName, 
                hostelNo: add_hostalNo, roomNo: add_roomNo, phoneNo: add_phoneNo};
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", err.message);
    } else {
      Address.create(newData, function(err,added)
      {
        added.save();
        foundUser.addresses.push(added);
        foundUser.save(function(err){
          foundUser.populate("addresses", function(err, newadded){
            res.render("ajax/addAddress",{foundUser: newadded})
            res.end();
          });
        });
      });
    }
  });
});


//delete address
router.delete("/check/add/:id", middleware.isLoggedIn, function(req, res){
    Address.findByIdAndRemove(req.params.id, function(err, address){
        if(err){
            req.flash("error", err.message);
        } else {
            User.findByIdAndUpdate(req.params.id,{
              $pull: {
                addresses: address.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('success', 'Address deleted');
                res.redirect("back");
              }
            });
        }
    });
});


// check out post request
router.post("/checkout",middleware.isLoggedIn, function(req, res,next){
  if(!req.session.cart || req.session.cart.totalQty===0){
    return res.redirect('/cart');
  }
  var cart= new Cart(req.session.cart);
  var stripe = require("stripe")(
    "sk_test_Wo0zE4ab9Ivymb13RS4UBZJA"
    );

  stripe.charges.create({
    amount:cart.totalCost * 100,
    currency:"inr",
    source: req.body.stripeToken,
    description: "test charge"
  }, function(err, charge){
      if(err){
        req.flash('error',err.message);
        return res.redirect("/checkout");
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        status: req.body.status,
        paymentType: req.body.paymentType,
        paymentId: charge.id
      })
      order.save(function(err, result){
        req.flash("success","succcessfully bought product!");
        req.session.cart = null;
        res.redirect('/');
      });
      
  });
});

//checkout by cash on deleivery
router.post("/checkoutcod", middleware.isLoggedIn,function(req, res){
  if(req.body.promoStatus === "Promo code applied"){
    req.session.cart.totalCost = req.session.cart.totalCost - 50;
    var newData = {firstUser: true}
    User.findByIdAndUpdate(req.user.id, {$set: newData}, function(err, updatedStatus){
      if(err){
            console.log(err);
            return res.redirect('/cart');
        } else {
    
        }
  })
  }
  if(!req.session.cart || req.session.cart.totalQty===0){
    return res.redirect('/cart');
  }
  var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      type: 'OAuth2',
      user:'vivekshakrawar74@gmail.com',
      clientId:'473193405731-ukeha6935ohggvuml1dbcfesa1216iun.apps.googleusercontent.com',
      clientSecret:'dibUKPl-qVoNWXW4FiV1gAAG',
      refreshToken:'1/mpeFAc4nPX8QSqOcxAU0MGvi-V5mdXIJpD2LFTGbTjw',
      accessToken:'ya29.GltWBS4dlMjiaQHqXAgsfurgtSBoodvP2Y9Mu1ZAch2dUQf2VXAusxJ61hbbAs7_Qf-Q25UPtPyxqsfnYAW-oLQ3JjuC8oRiAKcjVgcoH9h01hh-O96J2moniUqi'
    },
  });
  var mailOptions={
    to: req.user.email,
    from: 'vivekshakrawar74@gmail.com',
      subject: 'Order confirmation',
      text: 'Your order has been placed successfully \n\n' + 'Total Payable amount ₹ ' + req.session.cart.totalCost + '\n\n' + 'Regards\nTeam Torsokart.'
  };
  transporter.sendMail(mailOptions, function(err) {
    if(err){
      req.flash('error', 'Something went wrong please try after sometime.');
      res.redirect("back");
    } else {
      var cart= new Cart(req.session.cart);
      var order = new Order({
        user: req.user,
        cart: cart,
        paymentId: "null",
        status: req.body.status,
        paymentType: "COD"
      });
      order.save(function(err, result){
        req.session.cart = null;
        req.flash("success","Order placed successfully!");
        res.redirect('/cart');
      });
    }
  });
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// handle sign up logic
router.post("/register", function(req, res){

  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    req.flash("error", "Please select captcha");
    res.redirect('back');
  }
  // Put your secret key here.
  var secretKey = "6LdqSlUUAAAAACtahklnKQXX7vw142SW1x-eTMht";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      req.flash("error", "Failed captcha verification");
      res.redirect('back');
    }
    var newUser = new User({
        username: req.body.username,
        //firstName: req.body.firstName,
        //lastName: req.body.lastName,
        email: req.body.username,
        //phone : req.body.phone,
        //avatar: req.body.avatar,
        //add_firstName: req.body.firstName,
        //add_lastName: req.body.lastName,
        //add_hostalNo: req.body.add_hostalNo,
        //add_roomNo: req.body.add_roomNo,
        passwordCopy: req.body.password
      });

    if(req.body.adminCode === 'secretcode123') {
      newUser.isAdmin = true;
    }
    if(req.body.password === req.body.confirm){
        User.register(newUser, req.body.password, function(err, user){
          if(err){
              console.log(err);
              return res.render("register", {error: err.message});
          }
          passport.authenticate("local")(req, res, function(){
            if (req.session.oldUrl) {
              var oldUrl = req.session.oldUrl;
              req.session.oldUrl = null;
              req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.firstName);
              res.redirect(oldUrl);
            } else {
              req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.firstName);
              res.redirect("/");
            } 
          });
      });
    } else {
      req.flash("error", "Password do match");
      res.redirect('back');
    }

  });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        failureRedirect: "/login",
        failureFlash: true,
    }), function(req, res, next){
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect("/");
  }
});

//model login
router.post('/login-model', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {failureRedirect: "/login"}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.render("ajax/verified",{currentUser:user});
      
    });
  })(req, res, next);
});

// end login

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success","Successfully Logged Out!");
  res.redirect("/");
});

//logout model
router.get("/logout-model", function(req, res){
  req.logout();
  res.render("ajax/logoutVerified")
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter=nodemailer.createTransport({
        service:'gmail',
        host: "smtp.gmail.com",
        auth:{
                type: 'OAuth2',
                user:'vivekshakrawar74@gmail.com',
                clientId:'473193405731-ukeha6935ohggvuml1dbcfesa1216iun.apps.googleusercontent.com',
                clientSecret:'dibUKPl-qVoNWXW4FiV1gAAG',
                refreshToken:'1/mpeFAc4nPX8QSqOcxAU0MGvi-V5mdXIJpD2LFTGbTjw',
                accessToken:'ya29.GltWBS4dlMjiaQHqXAgsfurgtSBoodvP2Y9Mu1ZAch2dUQf2VXAusxJ61hbbAs7_Qf-Q25UPtPyxqsfnYAW-oLQ3JjuC8oRiAKcjVgcoH9h01hh-O96J2moniUqi'
              },
        })
      var mailOptions = {
        from: 'vivekshakrawar74@gmail.com',
        to: user.email,
        subject: 'Reset Password',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        //console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          type: 'OAuth2',
          user:'vivekshakrawar74@gmail.com',
          clientId:'473193405731-ukeha6935ohggvuml1dbcfesa1216iun.apps.googleusercontent.com',
          clientSecret:'dibUKPl-qVoNWXW4FiV1gAAG',
          refreshToken:'1/mpeFAc4nPX8QSqOcxAU0MGvi-V5mdXIJpD2LFTGbTjw',
          accessToken:'ya29.GltWBS4dlMjiaQHqXAgsfurgtSBoodvP2Y9Mu1ZAch2dUQf2VXAusxJ61hbbAs7_Qf-Q25UPtPyxqsfnYAW-oLQ3JjuC8oRiAKcjVgcoH9h01hh-O96J2moniUqi'
        },
      });
      var mailOptions = {
        to: user.email,
        from: 'vivek <vivekshakrawar74@gmail.com>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

//contact us

router.post("/contact", function(req, res){
  //console.log(req.body);
  var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      type: 'OAuth2',
      user:'vivekshakrawar74@gmail.com',
      clientId:'473193405731-ukeha6935ohggvuml1dbcfesa1216iun.apps.googleusercontent.com',
      clientSecret:'dibUKPl-qVoNWXW4FiV1gAAG',
      refreshToken:'1/mpeFAc4nPX8QSqOcxAU0MGvi-V5mdXIJpD2LFTGbTjw',
      accessToken:'ya29.GltWBS4dlMjiaQHqXAgsfurgtSBoodvP2Y9Mu1ZAch2dUQf2VXAusxJ61hbbAs7_Qf-Q25UPtPyxqsfnYAW-oLQ3JjuC8oRiAKcjVgcoH9h01hh-O96J2moniUqi'
    },
  });
  var mailOptions={
    to: 'vivekshakrawar74@gmail.com',
    from: 'vivekshakrawar74@gmail.com',
      subject: 'Contacting',
      text: req.body.body + '\n\n' + 'name : ' + req.body.name + '\n\n' + 'Email : ' + req.body.email + '\n'
  };
  transporter.sendMail(mailOptions, function(err) {
    if(err){
      req.flash('error', 'Something went wrong please try after sometime.');
      res.redirect("back");
    } else {
      req.flash('success', 'Success! Your request has been send.');
      res.redirect("back");
      //console.log('email sent');
    }
  });
});


// USER PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Order.find({user: req.params.id},function(err, orders) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      var cart;
      orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render("users/show", {user: foundUser, orders: orders});
    });
  });
});

//showing recent orders
router.get("/orders/:id", middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Order.find({user: req.params.id},function(err, orders) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      var cart;
      orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render("users/orders", {user: foundUser, orders: orders});
    });
  });
});

//showing terms and condition page
router.get("/terms_and_conditions", function(req, res) {
  res.render("terms")
});

router.post("/checkout/verifyPromo", middleware.isLoggedIn, function(req, res){
  //console.log(req.body);
  //console.log(req.user);
  //req.session.cart.totalCost = req.session.cart.totalCost - 50;
  if(!req.session.cart || req.session.cart.totalQty===0){
    return res.redirect("/cart");
  }
  User.findById(req.user.id, function(err, foundUser){
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    var cart=new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  if(req.user.firstUser === false){
    if(req.body.appliedPromo === 'get50') {
      var promoStatus = "Promo code applied";
    } else {
      var promoStatus = "Entered promo code is not valid";
    }
  } else {
    if(req.body.appliedPromo === 'get50'){
      var promoStatus = "Already applied";
    } else {
      var promoStatus = "Entered promo code is not valid";
    }
  }
  res.render("checkout",{products: cart.generateArray(), total: cart.totalCost, errMsg: errMsg, noError: !errMsg, foundUser: foundUser, promoStatus: promoStatus });
  });
  
});

router.get("/customDesign", function(req, res){
  res.render("customDesign");
});

//post request

router.post("/customDesign", function(req, res){

  var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      type: 'OAuth2',
      user:'vivekshakrawar74@gmail.com',
      clientId:'473193405731-ukeha6935ohggvuml1dbcfesa1216iun.apps.googleusercontent.com',
      clientSecret:'dibUKPl-qVoNWXW4FiV1gAAG',
      refreshToken:'1/mpeFAc4nPX8QSqOcxAU0MGvi-V5mdXIJpD2LFTGbTjw',
      accessToken:'ya29.GltWBS4dlMjiaQHqXAgsfurgtSBoodvP2Y9Mu1ZAch2dUQf2VXAusxJ61hbbAs7_Qf-Q25UPtPyxqsfnYAW-oLQ3JjuC8oRiAKcjVgcoH9h01hh-O96J2moniUqi'
    },
  });
  var mailOptions={
    to: 'vivekshakrawar74@gmail.com',
    from: 'vivekshakrawar74@gmail.com',
      subject: 'Contacting',
      text: req.body.description + '\n\n' + 'Email : ' + req.body.email + '\n\n' +  'Color : ' + req.body.color +'\n\n' + 'Material : ' + req.body.material + '\n\n' + 'Neck : ' + req.body.neck + '\n\n' + 'Sleeve :' + req.body.sleeve + '\n\n' + 'Design :' + req.body.design +'\n' + "Phone: " + req.body.phone +'\n'
  };
  transporter.sendMail(mailOptions, function(err) {
    if(err){
      console.log(err);
      req.flash('error', 'Something went wrong please try after sometime.');
      res.redirect("back");
    } else {
      req.flash('success', 'Success! Your request has been send.');
      res.redirect("back");
      //console.log('email sent');
    }
  });
});

module.exports = router;
