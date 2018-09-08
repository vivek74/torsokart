var express = require("express");
var aws = require('aws-sdk');
var bodyParser = require('body-parser');
var multer=require('multer');
var multerS3 = require('multer-s3');
var ejs= require('ejs');
var path= require('path');
var router  = express.Router();
var Category1 = require("../models/category1");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var Banner = require("../models/banner");
var shortid = require('shortid');

aws.config.update({
    secretAccessKey: 'secretAccessKey',
    accessKeyId: 'accessKeyId'
});
var app = express(),
    s3 = new aws.S3();

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//NEW - show form to create new category
router.get("/new", middleware.isLoggedIn, function(req, res){
  Category1.find({}, function(err , allCategories){
    if(err){
            console.log(err);
        } else {
            //redirect back to category page
            res.render("category/new",{category: allCategories});
        }
  });
    
});

//CREATE - add new category to DB
router.post("/new", middleware.isLoggedIn, function(req, res){
  //console.log(req.body);
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var category = req.body.category;
  var fabric = req.body.fabric;
  var sleave = req.body.sleave;
  var sutable = req.body.sutable;
  var fit = req.body.fit;
  var necktype = req.body.necktype;
  var fabriccare = req.body.fabriccare;
  var cost = req.body.cost;
  var orignal_price= req.body.orignal_price;
  var size1 =req.body.size1;
  var size2 =req.body.size2;
  var size3 =req.body.size3;
  var size4 =req.body.size4;
  var size5 =req.body.size5;
  var colour =req.body.colour;
  var product_no= req.body.product_no; 
    var newCategory1 = {name: name, image: image, description: desc, 
      cost: cost, author:author, category:category, fabric: fabric, 
      sleave: sleave, sutable: sutable, fit: fit, necktype: necktype, 
      fabriccare:fabriccare, size1:size1, size2:size2, size3:size3, size4:size4, size5:size5,
      colour:colour, orignal_price:orignal_price, product_no:product_no };
    // Create a new category and save to DB
    Category1.create(newCategory1, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/category/" + category);
        }
    });
  });


//INDEX - show all category
router.get("/:category", function(req, res){ 
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
                Banner.find({"category":req.params.category}, function(err,allbanners){
                  if(err){
                    console.log(err);
                  }else{
                    if(req.xhr) {
                      res.json(allCategories);
                    } else {
                      res.render("category/showAll",{allbanners:allbanners, category: allCategories, page: 'category', current: pageNumber, pages: Math.ceil(count / nPerPage), showCategories:showCategories});
                    }
                  }
                }) 
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
                  Banner.find({category:req.params.category}, function(err,allbanners){
                    if(err){
                      console.log(err);
                    }else{
                      if(req.xhr) {
                        res.json(allCategories);
                      } else {
                        res.render("category/showAll",{allbanners:allbanners,category: allCategories, page: 'category', current: pageNumber, pages: Math.ceil(count / nPerPage), showCategories: showCategories});
                      }
                    }
                  })
               }
              })  
            });
          }
      }  
    }
});





router.get("/allproduct", function(req, res){ 
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
      Category1.find({}, function(err, allCategories){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allCategories);
            } else {
              res.render("category/showAll",{category: allCategories, page: 'category'});
            }
         }
      });
  }
});

// aws
var storage= multerS3({
  s3: s3,
  bucket: 'torsokart-image/tshirts',
  ACL:'public-read-write',
  key: function (req, file, cb) {
    //console.log(file);
    cb(null, file.originalname); //use Date.now() for unique file keys
  }
});

var upload=multer({
  storage: storage,
  fileFilter: function(req, file,cb){
    checkFileType(file,cb);
  }
}).single('myImage');

//


//check file type
function checkFileType(file,cb){
  //allowed ext
  var filetypes = /jpeg|jpg|png|gif/;
  //check ext
  var extname = filetypes.test(path.extname
    (file.originalname).toLowerCase());
  //check mime
  var mimetype=filetypes.test(file.mimetype);
  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

//init app
 var app= express();

//ejs
app.set('view engine','ejs');

//set public folder
app.use(express.static('./public'));

router.post("/upload", middleware.isLoggedIn,function(req,res){

  Category1.find({}, function(err , allCategories){
    if(err){
            console.log(err);
        } else {
            //redirect back to category page
          upload(req, res, (err) =>{
          if(err){
            res.render('category/new',{
            msg:err
          });
        } else{
          if(req.file == undefined){
          res.render('category/new',{
          msg:'Error: No File Selected!'
        });
        } else {
          console.log(req.file.originalname);
          res.render('category/new',{ category: allCategories, msg: 'File Uploaded!',file: `https://s3.ap-south-1.amazonaws.com/torsokart-image/tshirts/${req.file.originalname}`
        });
      }
    }
  });      }
});
});

//end


// SHOW - shows more info about one category
router.get("/:category/:id", function(req, res){
  var showCategories = req.params.category;
  var pageNumber = 1;
  var nPerPage = 4;
  var total = (( pageNumber - 1 ) * nPerPage ) + nPerPage;

  // Category1.count().exec(function(err,count){

  showMore(total);
  function showMore(total = 4){
    Category1.findById(req.params.id).populate("comments").exec(function(err, foundCategory){

      Category1.aggregate([{'$match':{"category":req.params.category}}, {'$sample':{"size": total}}],function(err,similer){
        Category1.find({"category":req.params.category}).count().exec(function(err,count){
          res.render("category/showProduct", {current: pageNumber, category: foundCategory, similer: similer, showCategories:showCategories, pages: Math.ceil(count / nPerPage)});
        });
      });

    });
  }
});


// edit
router.get("/:category/:id/edit", middleware.checkCategoryOwnership, function(req, res){
    //find the category with provided ID
    Category1.findById(req.params.id, function(err, foundCategory){
        if(err){
            console.log(err);
        } else {
            //render show template with that category
            res.render("category/edit", {category: foundCategory});
        }
    });
});

router.put("/:category/:id", middleware.checkCategoryOwnership, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var category = req.body.category;
  var fabric = req.body.fabric;
  var sleave = req.body.sleave;
  var sutable = req.body.sutable;
  var fit = req.body.fit;
  var necktype = req.body.necktype;
  var fabriccare = req.body.fabriccare;
  var cost = req.body.cost;
  var orignal_price= req.body.orignal_price;
  var size1 =req.body.size1;
  var size2 =req.body.size2;
  var size3 =req.body.size3;
  var size4 =req.body.size4;
  var size5 =req.body.size5;
  var serial_no =req.body.serial_no;
  var product_no= req.body.product_no; 
    var newData = {name: name, image: image, description: desc, 
      cost: cost, category:category, fabric: fabric, 
      sleave: sleave, sutable: sutable, fit: fit, necktype: necktype, 
      fabriccare:fabriccare, size1:size1, size2:size2, size3:size3, size4:size4, size5:size5,
      serial_no:serial_no, orignal_price:orignal_price, product_no:product_no };

    Category1.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCategory){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/category/" + req.params.category + '/' + updatedCategory._id);
        }
    });
  });

router.delete("/:category/:id", middleware.checkCategoryOwnership,function(req, res) {
  Category1.findByIdAndRemove(req.params.id, function(err, category) {
    Comment.remove({
      _id: {
        $in: category.comments
      }
    }, function(err, comments) {
      req.flash('error', category.name + ' deleted!');
      res.redirect('/category' + '/' + req.params.category );
    })
  });
});



module.exports = router;

