import mongoose  from "mongoose";

const userSchema=new mongoose.Schema({
    "username":{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    "fullName":{
        type:String,
        required:true,
        trim:true
    },
    "password":{
        type:String ,
        required:true,
        minLength:6,
        trim:true
    },
    "email":{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    "followers":[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    "following":[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    "profileImg":{
        url:{
            type:String,
            default:""
        },
        publicId:{
            type:String,
            default:""
        }
    },
    "coverImg":{
        url:{
            type:String,
            default:""
        },
        publicId:{
            type:String,
            default:""
        }
    },
    "bio":{
        type:String,
        default:""
    },
    "link":{
        type:String,
        default:""
    },

    "likedPosts":[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:[]

    }]
},{timestamps:true})

const User=new mongoose.model("User",userSchema);

export default User