//  defines a Mongoose schema and model for tasks in your application. 
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
    },
    important: {
        type: Boolean,
        default: false,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    },
    { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);