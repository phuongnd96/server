const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BillSchema = new Schema({
    billId: { type: String, require: true },
    name: String,
    phone: String,
    email: String,
    isPaid: Boolean,
    purchaseDate: { type: Date},
    paidDate:{ type: Date},
    products: [
        {
            productId: String,
            color: String,
            quantityPurchase: Number,
            price: Number,
            total: String
        }
    ]
})
exports.BillModels = mongoose.model('BillModels', BillSchema);
