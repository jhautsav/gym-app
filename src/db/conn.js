const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://admin:Utsav@1998@cluster0.rfnpr.mongodb.net/gymdata',{
   useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
} ).then(()=>{
    console.log('connection scuessful');
}).catch((e)=>{
    console.log(e);
}) 
 