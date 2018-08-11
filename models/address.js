var mongoose = require("mongoose");

var addressSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNo: Number,
    hostelNo: String,
    roomNo: String
});
module.exports = mongoose.model("Address", addressSchema);