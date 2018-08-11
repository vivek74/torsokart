var mongoose = require("mongoose");

var category1Schema = new mongoose.Schema({
   category: String, 
   name: String,
   image: String,
   description: String,
   cost: Number,
   orignal_price: Number,
   pattern: String,
   fabric: String,
   sleave: String,
   sutable: String,
   fit: String,
   necktype: String,
   fabriccare: String,
   size1: String,
   size2: String,
   size3: String,
   size4: String,
   size5: String,
   colour: String,
   product_no: String,
   no_of_purchased: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
},
   {
        usePushEach: true 
     });

module.exports = mongoose.model("Category1", category1Schema);