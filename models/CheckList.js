const mongoose = require('mongoose')
const CheckListSchema = new mongoose.Schema({
    user : {
        required : true,
        type : String
    },
    email : {
        type : String,
        required : true
    },
    note : {
        type : String,
        required : true,
        maxlength : 140
    },
    progress : {
        type : String,
        enum : ['complete','ongoing','uncomplete'],
        default : 'uncomplete',
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});
const CheckListModel = mongoose.model('checklist',CheckListSchema)
module.exports = CheckListModel