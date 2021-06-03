
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const path = require('path');
const hbs = require('hbs');
const nodemailer = require('nodemailer');

/*this is for uploading image for admin panel */
const multer = require('multer');
/*this is for end uploading image for admin panel */

/*require connection */
require('./db/conn');
/*require end of connection */

/*require schema and models*/
const login = require('./models/login');
const maildetails = require('./models/email');
const trainer = require('./models/trainerdetails');
/*require end of schema and models*/


/*for using bcrupt function */
const bcrypt = require('bcryptjs');
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

/*for serving dynamic website using hbs */
app.set('view engine', 'hbs');
app.set('views', templatePath);
/*end of code serving dynamic websit using hbs */


//***********ROUTING**********************/
app.get('/', (req, res) => {
    res.render('signup');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})


app.get('/register', (req, res) => {
    res.render('register')
})
//here fetch data from database
const storeData = login.find({});
app.get('/indexadmin', async (req, res) => {
    const dataPrint = await storeData.exec((err, data) => {
        if (err) { throw err; }
        else {

            res.render('indexadmin', { result: data });
        }
    })
})
app.get('/user', (req, res) => {
    res.redirect('/indexadmin');
})
//this is for delting
app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    const del = login.findByIdAndDelete(id);
    const dataPrint = await del.exec((err) => {
        if (err) { throw err; }
        else {

            res.redirect('/indexadmin');

        }

    })
})
app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const edit = login.findById(id);
    const findData = await edit.exec((err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.render('edit', { title: 'Edit your userdata', resultdata: data });

        }

    })


})
//for updating

app.post('/update', async (req, res) => {

    const update = login.findByIdAndUpdate(req.body.id, {
        fName: req.body.fName,
        lName: req.body.LName,
        phone: req.body.phone,
        email: req.body.email
    })

    const updateData = await update.exec((err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.redirect('/indexadmin');

        }

    })
})
//herer for mail 
const emaildataget = emaildetails.find({});
app.get('/mail', async (req, res) => {


    const emaildataPrint = await emaildataget.exec((err, data) => {
        if (err) { throw err; }
        else {

            res.render('mail', { emailresult: data });

        }

    })
})
//     //maildeleting
app.get('/delemail/:id', async (req, res) => {
    const id = req.params.id;
    const deletedata = emaildetails.findByIdAndDelete(id);
    const deleteafterdata = await deletedata.exec((err) => {
        if (err) {
            throw err;
        }
        else {
            res.redirect('/mail')
        }
    })

})

//mail editing
//first finding 
app.get('/editmail/:id', async (req, res) => {
    const id = req.params.id;

    const readdata = emaildetails.findById(id);

    const savereaddata = await readdata.exec((err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.render('editmail', { resultmail: data });
        }
    })

})
//update
app.post('/emailupdate', async (req, res) => {
    const updateemail = emaildetails.findByIdAndUpdate(req.body.id, {
        username: req.body.username,
        email: req.body.email,
        subject: req.body.subject,
        text: req.body.text
    })
    const updateemaildata = await updateemail.exec((err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.redirect('/mail');

        }
    })
})
app.get('/dataupload', (req, res) => {
    res.render('dataupload');
})
//this is for gettting name of file

const storage = multer.diskStorage({
    destination: "../public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

//this is middleware for single file
var upload = multer({
    storage: storage
}).single('file'); //'file' yaha pe filedname hai



app.post('/imgupload', upload, (req, res) => {
    const file = req.file.filename;
    console.log(file);
    const category = req.body.category;
    const fullName = req.body.fullName;
    const desc = req.body.desc;
    const facebook = req.body.facebook;
    const twitter = req.body.twitter;
    const linkedin = req.body.twitter;
    const trainerDetails = new trainer({
        file: file,
        category: category,
        fullName: fullName,
        desc: desc,
        facebook: facebook,
        twitter: twitter,
        linkedin: linkedin
    })

    const finalTrainerDetails = trainerDetails.save((err, data) => {
        if (err) { throw err; }
        else {
            res.redirect('indexadmin');
        }


    })
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
            res.status(201).render('signup', { scuess: 'You have been successfully registered.', result: true, value1: 'success' });
        }

        else {
            res.status(401).render('register', { scuess: 'Password confirmation and Password must match.', result: true, value1: 'warning' });
        }

    }
    catch (e) {
        res.status(401).render('register', { scuess: 'Password confirmation and Password must match.', result: true, value1: 'warning' });
    }
})
/* this is for end of  registration*/


/* this is for login credentials*/
const trainerData = trainer.find({});
app.post('/signup', async (req, res) => {
    try {
        const passread = req.body.password;
        const emailread = req.body.username;
        const emailval = await login.findOne({ email: emailread });
        const isMatch = await bcrypt.compare(passread, emailval.password);
        trainerData.exec((err, data) => {
            if (isMatch) {
                res.status(201).render('index', { scuess: 'You have been successfully logged in.', result: true, imagedata: data, value1: 'success', fName: emailval.fName });
            }
            else {
                res.status(401).render('signup', { scuess: 'Incorrect user ID or password', result: true, value1: 'warning' })
            }

        })

    }
    catch (e) {
        res.status(401).render('signup', { scuess: 'Incorrect user ID or password', result: true, value1: 'warning' })
    }
});
/* this is for end of login credentials */
app.post('/email', async (req, res) => {
    try {
        const usrname = req.body.username;
        const email = req.body.email;
        const subject = req.body.subject;
        const text = req.body.text;
        const saveData = new emaildetails({
            username: usrname,
            email: email,
            subject: subject,
            text: text
        })


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'utsavmaithili@gmail.com',
                pass: 'Utsav@1998'
            }
        });
        const mailOptions = {
            from: 'utsavmaithili@gmail.com',
            to: 'utsavjha2020@gmail.com',
            subject: subject,

            html: `<p>hiii i am ${usrname}</p>
          <p>contact : ${email}</p>
          <p>messege:${text}</p>`
        };

        const sendMail = await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                trainerData.exec((err, data) => {
                    res.status(201).render('index', { scuess: 'You have been successfully sent mail.', result: true, imagedata: data, value1: 'success' });

                })

            }
        })
        const saveInsert = await saveData.save();
    }
    catch (e) {
        res.status(401).send(e);
    }
})
app.get('/*', (req, res) => {
    res.render('404');
})

app.listen(port, () => {
    console.log(`connecte at server ${port}`);
})