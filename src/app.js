
const express = require('express');
const app = express();
// const port = process.env.PORT || 5000;
app.set( 'port', ( process.env.PORT || 5000 ));
const path = require('path');
const hbs = require('hbs');
 const nodemailer=require('nodemailer');

/*require connection */
require('./db/conn');
 
/*require end of connection */

/*require schema and models*/
const login = require('./models/login');
const maildetails=require('./models/email');
/*require end of schema and models*/

/*for using bcrupt function */
const bcrypt=require('bcryptjs');
const emaildetails = require('./models/email');
/*for end of  bcrupt function */


//for serving static website
const staticPath = path.join(__dirname, '../public');
//end of serving static website

/*serving dynamic website and set directries */
const templatePath = path.join(__dirname, '../templates/views');
const partialstePath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialstePath);
/*serving dynamic website and set directries */


app.use(express.static(staticPath));
app.use(express.json());

/* for reading front end data */
app.use(express.urlencoded({ extended: false }));
/* end code for reading front end data */

//for serving dynamic website using hbs
app.set('view engine', 'hbs');
app.set('views', templatePath);
//end of code serving dynamic websit using hbs
app.get('/', (req, res) => {
    res.render('signup');
})
app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/register', (req, res) => {
    res.render('register')
})


/* this is for registration*/

app.post('/register', async (req, res) => {
    try {
        password = req.body.password;
        cnfPassword = req.body.cnfPassword;

        if (password === cnfPassword) {
            const insert = new login({
                email: req.body.email,

                fName: req.body.fName,
                lName: req.body.lname,
                phone: req.body.phone,
                password: req.body.password,
                cnfPassword: req.body.cnfPassword,
            })

            /* code for middleware*/
            //this code define in login js page
            /*end of middleware code */

            const saveInsert = await insert.save();
            res.status(201).render('signup',{scuess:'you are scuessfully register',result:true,value1:'success'});
        }

        else 
        {
            res.status(401).render('register',{scuess:'your password in not match',result:true,value1:'warning'});
        }

    }
    catch (e) 
    {
        res.status(400).send(e);
    }
})
/* this is for end of  registration*/


/* this is for login credentials*/
app.post('/signup', async (req, res) => {
    try {
        const passread = req.body.password;
        const emailread = req.body.username;
        const emailval = await login.findOne({ email: emailread });
        const isMatch= await bcrypt.compare(passread,emailval.password);
        if (isMatch) 
        {
            res.status(201).render('index',{fName:emailval.fName,scuess:'you are scuessfully login',result:true,value1:'success'});
        }
        else
         {
            res.status(401).render('signup',{scuess:'your data is not match',result:true,value1:'warning' })
        }

    }
    catch (e) {
        res.status(404).send('invalid email here');
    }
});
/* this is for end of login credentials */
app.post('/email',async(req,res)=>{
    try
    {
    const usrname=req.body.username;
     const email=req.body.email;
     const subject=req.body.subject;
     const text=req.body.text; 
     const saveData = new emaildetails({
        username: usrname,
         email: email,
         subject: subject,
         text:text
     })
     const saveInsert = await saveData.save();
    
      const transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
              user:'utsavmaithili@gmail.com',
              pass:'Utsav@1998'
          }
      });
      const mailOptions={
          from:'utsavmaithili@gmail.com',
          to:'utsavjha2020@gmail.com',
          subject:subject, 
           
          html:`<p>hiii i am ${usrname}</p>
          <p>contact : ${email}</p>
          <p>messege:${text}</p>`
      };
       
       const sendMail= await transporter.sendMail(mailOptions,function(error,info)
      {
          if(error)
          {
              console.log(error);
          }
          else{
            
           res.render('index',{scuess:'',result:true,value1:'success'});
        }
      })
    }
    catch(e)
    {
        res.status(401).send(e);
    }

     
 

})
app.get('/*',(req,res)=>{
    res.render('404');
})
 

/* this is for email */


/* this is for end of email */
app.listen(app.get( 'port' ), () => {
    console.log(`connecte at server`+ app.get( 'port' ));
})