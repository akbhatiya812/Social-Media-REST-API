const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commenctSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isParent:{
        type:Boolean,
        default:true,
    },
    likes : [ {type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [this],
}, {timestamps:true})

module.exports = mongoose.model('Comment', commenctSchema);