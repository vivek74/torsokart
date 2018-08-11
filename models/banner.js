var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bannerSchema= new Schema({
	category: String,
	banner1: String,
   	banner2: String,
   	banner3: String,
});

module.exports= mongoose.model('Banner', bannerSchema);