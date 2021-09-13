const {  model, Schema } = require('mongoose');


const user_schema = new Schema(
    {
        username:
        {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email:
        {
            type: String,
            unique: true,
            required: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        thoughts:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
        ]
    },
    {
        toJSON:{
            virtuals:true
        },
        id:false
    }
);

//virtual that retrieves the length of the user's friends 
user_schema.virtual('friendCount').get(function(){
    return this.friends.length;
})

// create the User Model using the User's Schema
const User=model('User',user_schema);

// export the User model
module.exports=User;