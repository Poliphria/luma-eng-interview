const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    _id: Schema.Types.ObjectId,
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    specialization: { type: String },
    workingHoursByDay: [{
        day: { type: String, required: true},
        hours: {
            startTime: {type: String, required: true},
            endTime: {type: String, required: true}
        }
    }]
});

module.exports = mongoose.model('Doctor', doctorSchema);