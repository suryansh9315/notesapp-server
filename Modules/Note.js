const mongoose = require('mongoose')
const { Schema } = mongoose;

const NoteSchema = new Schema({
    mainid:{type:mongoose.Schema.Types.ObjectId,required:true},
    title: {type:String,required:true},
    author: {type:String},
    desc:{type:String},
    tag: {type:String,default:"General"},
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notes",NoteSchema)