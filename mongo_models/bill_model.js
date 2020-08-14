const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BillSchema = new Schema({
    billId: { type: String, require: true },
    name: String,
    phone: String,
    email: String,
    address:String,
    isPaid: Boolean,
    purchaseDate: { type: Date},
    paidDate:{ type: Date},
    products: [
        {
            productName: String,
            quantity: Number,
            price: Number,
            total: Number
        }
    ]
})
exports.BillModels = mongoose.model('BillModels', BillSchema);
