const { Schema, model } = require('mongoose');
const reactionSchema=require('./Reaction');
const dateFormat=require('../utils/dateFormat')
const thought_Schema = new Schema(
    {
        thoughtText:
        {
            type: String,
            required:true,
            maxlength:280,
            minlength:1
        },
        createdAt:
        {
            type:Date,
            default:Date.now,
            get:createdAtVal=>dateFormat(createdAtVal)
        },
        username:
        {
            type:String,
           required: true
        },
        reactions:[reactionSchema]
    },
    {
        toJSON:{
            getters:true,
            virtuals:true
        },
        id:false
    }
)

thought_Schema.virtual('reactionCount').get(function(){
    return this.reactions.length;
})

const Thoughts=model('Thought',thought_Schema);

module.exports=Thoughts;