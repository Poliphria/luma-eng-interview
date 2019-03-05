const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    doctor: {type: Schema.Types.ObjectId, ref: 'Doctor'},
    patient: {type: Schema.Types.ObjectId, ref: 'Patient'},
    slotTime: {type: String, required: true},
    slotDate: {type: String, required: true}
})

module.exports = mongoose.model("Appointment", appointmentSchema);