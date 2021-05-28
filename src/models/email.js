const mongoose=require('mongoose');

//here we define the schema for email validation
const emailSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3
    },
    email:
    {
     type:String,
     require:true
    },
    subject:
    {
    type:String,
    require:true,
    min:10
    },
    text:
    {
    type:String,
    require:true,
    min:10

    }
})


//here we define the models of email                
const emaildetails=new mongoose.model('emaildetails',emailSchema);

//here is we are going to export the database

module.exports=emaildetails;
 