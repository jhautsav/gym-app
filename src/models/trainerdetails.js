const mongoose=require('mongoose');

//here we define the schema for email validation
const trainerSchema=new mongoose.Schema({
    file:{
        type:String,
        require:true
         
    },
    category:
    {
     type:String,
     require:true
    },
    fullName:
    {
    type:String,
    require:true
    },
    desc:
    {
    type:String,
    require:true 
 },
 facebook:
 {
 type:String,
 require:true 
},
twitter:
{
type:String,
require:true 
},
linkedin:
{
type:String,
require:true 
}
})


//here we define the models of email                
const trainer=new mongoose.model('trainer',trainerSchema);

//here is we are going to export the database

module.exports=trainer;
 