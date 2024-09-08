const mongoose=require('mongoose')
const validator=require('validator')
const studentSchema =new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        email:{
            type:String,    
            required:true,
            unique:true,
            validate:[validator.isEmail,'you must enter a valid email']
        },
        password:{
            type:String,
            required:true
        },
        image:{
        type:String
        },
        token:{
            type:String
        }
    }
)

module.exports=mongoose.model("Student",studentSchema)