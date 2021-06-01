const express=require('express');
const app=express();
const port = process.env.PORT || 8000;
const hbs=require('hbs');
const path=require('path');
//this is for uploading image
const multer=require('multer');
require('../../src/db/conn')
const staticPath=path.join(__dirname,'../public');
 
app.use(express.static(staticPath));
const login=require('../../src/models/login');
const emaildetails=require('../../src/models/email');
/*serving dynamic website and set directries */
const templatePath = path.join(__dirname, '../templates/views');
const partialstePath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialstePath);


app.use(express.static(staticPath));
app.use(express.json());
 

/* for reading front end data */
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.set('views', templatePath);
 
// console.log(partialstePath);
app.use(express.json());
const storeData=login.find({});


//routing
  app.get('/', async (req,res)=>
    {
       const dataPrint=  await storeData.exec((err,data)=>{
             if(err) {throw err;}
             else
             {
                 
                res.render('index',{result:data});
                
             }
             
         }) 
    
    })
    app.get('/dataupload',(req,res)=>{
        res.render('dataupload');
    })
  //this is for uploading image
 
 const storage=multer.diskStorage({
     destination:"../public/uploads/",
     filename:(req,file,cb)=>{
         cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
     }
 });


 var upload=multer({
    storage:storage
}).single('file');

 app.post('/imgupload',upload,(req,res,next)=>
    {
        var s=req.file.filename;
console.log(s)
         res.send( `${s} and scuessfully`);
    })
  

    //this is for delting
     app.get('/delete/:id',async(req,res)=>{
         const id=req.params.id;
         
          const del=login.findByIdAndDelete(id);
          const dataPrint=  await del.exec((err)=>{
            if(err) {throw err;}
            else
            {
               
               res.redirect('/');
               
            }
            
        }) 
     })
     
     //this is for editing 

               //for finding
     app.get('/edit/:id',async(req,res)=>{
         const id=req.params.id;
         const edit=login.findById(id);
         const findData=  await edit.exec((err,data)=>{
            if(err)
             {
                 throw err;
            }
            else
            {
                res.render('edit',{title:'Edit your userdata',resultdata:data});
               
            }
            
        }) 
        

     })
               //for updating

    app.post('/update',async(req,res)=>{
      
        const update=login.findByIdAndUpdate(req.body.id,{
            fName:req.body.fName,
            lName:req.body.LName ,
            phone:req.body.phone,
            email:req.body.email
 })
 console.log(req.body.id);
 const updateData=  await update.exec((err,data)=>{
    if(err)
     {
         throw err;
    }
    else
    {
        res.redirect('/');
       
    }
    
}) 

    })
   
 
    const emaildataget=emaildetails.find({});
   
   
   
    //mail printing
    app.get('/user',(req,res)=>{
        res.redirect('/');
    })
    app.get('/mail', async (req,res)=>
    {
       
       const emaildataPrint=  await emaildataget.exec((err,data)=>{
             if(err) {throw err;}
             else
             {
                 
                res.render('mail',{emailresult:data});
                
             }
             
         }) 
    
    })

    //maildeleting
    app.get('/delemail/:id',async(req,res)=>{
        const id=req.params.id;
        const deletedata= emaildetails.findByIdAndDelete(id);
        const  deleteafterdata=await deletedata.exec((err)=>{
            if(err)
            {
                throw err;
            }
            else{
                res.redirect('/mail')
            }
        })
        
    })

    //mail editing
       //first finding 
       app.get('/editmail/:id',async(req,res)=>{
        const id=req.params.id;
         
        const readdata=emaildetails.findById(id);
        
        const  savereaddata=await readdata.exec((err,data)=>{
            if(err)
            {
                throw err;
            }
            else{
                res.render('editmail',{resultmail:data});
            }
        })

       })
       //update
       app.post('/emailupdate',async(req,res)=>{
           const updateemail=emaildetails.findByIdAndUpdate(req.body.id,{
               username:req.body.username,
               email:req.body.email,
               subject:req.body.subject,
               text:req.body.text
           })
           const updateemaildata=await updateemail.exec((err,data)=>{
            if(err)
            {
                throw err;
           }
           else
           {
               res.redirect('/mail');
              
           }
           })
       })

       app.get('/*',(req,res)=>{
           res.render('404');
       })
  
       

     
     
    
    

//listing
app.listen(port,()=>{
    console.log(`yes connecting at ${port}`);
})