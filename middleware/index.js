var Comment = require("../models/comment");
var Category1=require("../models/category1");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.session.oldUrl = req.url; 
        req.flash("error", "You must be signed in to do that!");
        //alert("Must signed to that");
        res.redirect("/login");
    },
    checkCategoryOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            Category1.findById(req.params.id, function(err, category){
               if(category.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/anime/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        //console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
              //console.log(comment);
               if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/category/" + req.params.category + "/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    }
}