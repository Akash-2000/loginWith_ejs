const mongooose = require('mongoose')

const Userschema = mongooose.Schema({
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true},
    date_of_birth:{type:String},
    country:{type:String},
    gender:{type:String},
    password:{type:String,required:true},
},{
    collection:'userdata'
}
)

const model = mongooose.model('userschema',Userschema)
module.exports = model