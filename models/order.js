var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderSchema= new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object, required: true},
	add_firstName: {type: String},
	add_lastName: {type: String},
	add_hostalNo: {type: String},
	add_roomNo: {type: String},
	add_phone: {type: String},
	name: {type: String},
	paymentId: {type: String, required: true},
	status: {type: String},
	paymentType: {type: String},
	cancle_order: {type: String},
	return_req: {type: String},
	response: {type: String},
	createdOrderAt: { type: Date, date: Date.now,  }
});

module.exports= mongoose.model('Order', orderSchema);
