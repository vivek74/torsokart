var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    joinedAt: { type: Date, default: Date.now },
    password: String,
    passwordCopy: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    phone: {type: Number, unique: true},

    add_firstName: {type: String},
    add_lastName: {type: String},
    add_hostalNo: {type: String},
    add_roomNo: {type: String},
    add_phoneNo: {type: String},
    
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false},
    firstUser: {type: Boolean, default: false},
    confirm: {type: Boolean, default: false},
    addresses: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Address"
      }
   ],

   productSeens: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productSeen"
        }
   ],

   wishLists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "wishList"
        }
   ],
   
   notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "notification"
        }
   ]
 },
  {
    usePushEach: true
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);