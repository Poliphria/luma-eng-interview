const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    _id: Schema.Types.ObjectId,
    firstName: { type: String, required: true},
    lastName: { type: String, required: true}, 
    insurance: {type: String },
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zip: {type: String}
    },
    ssn: {type: String, required: true},
    phoneNumber: { type: String, required: true },
    email: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', patientSchema);
