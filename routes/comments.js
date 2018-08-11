var express = require("express");
var router  = express.Router({mergeParams: true});
var Category1=require("../models/category1");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var User = require("../models/user");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find category by id
    //console.log(req.params.id);
    Category1.findById(req.params.id, function(err, category){
        if(err){
            console.log(err);
        } else {
          res.render("comments/new", {category: category});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
  //var newcomment = req.body.comment.newComment;
   //lookup category using ID
   //console.log(req.body.new);
   
   Category1.findById(req.params.id, function(err, category){
    //console.log(req.body.comment.newComment);
       if(err){
           console.log(err);
           res.redirect("/");
       } else {
        Comment.create({text:req.body.new}, function(err, comment){
          //console.log(req.body.comment.newComment);
           if(err){
              //console.log(req.body.comment.newComment);
               console.log(err);
           } else {
            //console.log(req.body.comment.newComment);
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.firstName;
               //comment.author.firstName = req.user.firstName;
               //save comment
               comment.save();
               category.comments.push(comment);
               category.save(function(err){
                  category.populate("comments",function(err, newcomment){
                  res.render("ajax/comments",{category: newcomment})
                  res.end();
               });
                //console.log(newcomment);
                
               

               /*Category1.findById(req.params.id).populate("comments").exec(function(err, foundCategory){
                  res.render("ajax/comments",{category: foundCategory})
                  res.end();
                });*/
                
               //req.flash('success', 'Created a comment!');
               //res.redirect('/category/' + category.category + '/' + category._id);
           });
        };
       });
       
   };
   
});
});
// router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
//     // find category by id
//     Comment.findById(req.params.commentId, function(err, comment){
//         if(err){
//             console.log(err);
//         } else {
//              res.render("comments/edit", {category_id: req.params.id, comment: comment});
//         }
//     })
// });

// router.put("/:commentId", function(req, res){
//    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
//        if(err){
//           console.log(err);
//            res.render("edit");
//        } else {
//            res.redirect("/anime/" + req.params.id);
//        }
//    }); 
// });

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
            req.redirect("/category");
        } else {
            Category1.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect('/category/' + req.params.category + '/' + req.params.id);
              }
            });
        }
    });
});

module.exports = router;