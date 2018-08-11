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
var Banner = require("../models/banner");



router.get("/", middleware.isLoggedIn,function(req,res){
    res.render("dashbord/dashbord");
});

//users

router.get("/users",middleware.isLoggedIn,function(req,res){
	User.find({},function(err,allusers){
		if(err){
			console.log(err);
		} else{
			res.render("dashbord/users",{allusers: allusers});
		}
	});
});

//All orders

router.get("/orders",middleware.isLoggedIn,function(req,res){
	Order.find({},function(err,allorders){
		if(err){
			console.log(err);
		} else{
			res.render("dashbord/orders",{allorders: allorders});
		}
	});
});

//all products

router.get("/products",middleware.isLoggedIn,function(req,res){
	res.render("dashbord/products")
});

//online

router.get("/online",middleware.isLoggedIn,function(req,res){
	Order.find({"paymentType":"Online"},function(err,allorders){
		if(err){
			console.log(err);
		} else{
			res.render("dashbord/online",{allorders: allorders});
		}
	});
});

//offline

router.get("/offline",middleware.isLoggedIn,function(req,res){
	Order.find({"paymentType":"COD"},function(err,allorders){
		if(err){
			console.log(err);
		} else{
			res.render("dashbord/offline",{allorders: allorders});
		}
	});
});

//todays order

router.get("/todaysOrder",middleware.isLoggedIn,function(req,res){
	Order.find({"createdOrderAt": {$gt:new Date(Date.now() - 24*60*60 * 1000)}},function(err,allorders){
		if(err){
			console.log(err);
		} else{
			//console.log(allorders.createdOrderAt);
			res.render("dashbord/todaysorder",{allorders: allorders});
		}
	});
});

//undelevered orders

router.get("/undelivered",middleware.isLoggedIn,function(req,res){
	Order.find({"status":"Not yet delevered"},function(err,allorders){
		if(err){
			console.log(err);
		} else{
			//console.log(allorders.createdOrderAt);
			res.render("dashbord/undelivered",{allorders: allorders});
		}
	});
});

//delevered orders

router.get("/delivered",middleware.isLoggedIn,function(req,res){
	Order.find({"status":"Delevered"},function(err,allorders){
		if(err){
			console.log(err);
		} else{
			//console.log(allorders.createdOrderAt);
			res.render("dashbord/delivered",{allorders: allorders});
		}
	});
});


//finding order

router.get("/orders/:id",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id, function(err, found) {
		if(err){
			console.log(err);
		} else{
			//console.log(req.params.id);
			res.render("dashbord/user_order",{found:found});
		}
	});
});

//update of status

router.put("/orders/update/:id",middleware.isLoggedIn,function(req,res){
	var newData = {status: "Delevered"}
	Order.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedStatus){
		if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/dashbord/orders");
        }
	});
});

//update cancle requested

router.put("/orders/update_cancle/:id",middleware.isLoggedIn,function(req,res){
	var newData = {cancle_order: "Order Canceled" , response: "Your request is being processed"}
	Order.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedStatus){
		if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Your cancle request has been sent!");
            res.redirect("back");
        }
	});
});

//update return requested

router.put("/orders/update_return/:id",middleware.isLoggedIn,function(req,res){
	var newData = {return_req: "Return Request" , response: "Your request is being processed"}
	Order.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedStatus){
		if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Your return request has been send!");
            res.redirect("back");
        }
	});
});

//response to user by admin

router.put("/orders/response/:id",middleware.isLoggedIn,function(req,res){
	var newData = {response: "Your request has being processed"}
	Order.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedStatus){
		if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Response has been send!");
            res.redirect("/dashbord/orders");
        }
	});
});

//update of status

router.put("/orders/update1/:id",middleware.isLoggedIn,function(req,res){
	var newData = {status: "Delevered"}
	Order.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedStatus){
		if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/dashbord/undelivered");
        }
	})
})

//admin profile


router.get("/AboutUs",function(req,res){
	res.render("dashbord/admin_profile");
});

// banner entry

router.get("/banner",middleware.isLoggedIn,function(req,res){
	res.render("dashbord/banner")
});

router.post("/banners",middleware.isLoggedIn,function(req,res){
	var category= req.body.category;
	var banner1 = req.body.banner1;
	var banner2 = req.body.banner2;
	var banner3 = req.body.banner3;
	var banners = {banner1:banner1, banner2:banner2, banner3:banner3, category:category};
	Banner.create(banners, function(err,newlycreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/dashbord/banner");
		}
	});
});

//update banner entry

router.put("/banners",middleware.isLoggedIn,function(req,res){
	var category= req.body.category;
	var banner1 = req.body.banner1;
	var banner2 = req.body.banner2;
	var banner3 = req.body.banner3;
	var newData = {banner1:banner1, banner2:banner2, banner3:banner3, category:category};
	Banner.update({"category":category}, {$set: newData}, function(err, updatedBanner){
		if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/dashbord/banner");
        }
	})
})

module.exports = router;