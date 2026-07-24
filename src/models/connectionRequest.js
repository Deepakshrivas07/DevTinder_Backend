const mongoose = require('mongoose')
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", //reference to User collection model.
        require:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    status:{
        type:String,
        require:true,
        enum:{
            values:["ignored" , "interested" , "accepted" , "rejected"],
            message:`{VALUE} is incorrect status type`,
        },
    },
},
{
    timestamps:true,
}
);

//compound index to create query more faster.
connectionRequestSchema.index({fromUserId:1,toUserId:1});

// this is what i have  talked about in request.js and api  "/request/send/:status/:touserId"
// here "save" is like event handler whenever we save the schema .pre middleware will called
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cant send request to your self😒")
    }
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema);
module.exports = ConnectionRequestModel;