const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/*here we create schema for our registration page*/
const loginSchma = new mongoose.Schema({
    fName: {
        type: String,
        require: true
    },
    lName: {
        type: String,
        require: true
    },
    password:
    {
        type: String,
        require: true
    },
    cnfPassword:
    {
        type: String,
        require: true
    },
    phone:
    {
        type: Number,
        require: true,
        min: 10
    },
    email:
    {
        type: String,
        require: true,
        unique: true
    }
})
/*here we create schema for our registration page*/


/*here we code for hashing our password using bcryptjs */
loginSchma.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.cnfPassword = undefined;
    }
    next();
})
/*here we code for  end of hashing our password using bcryptjs */


/*here we created models for collectioh */
const login = new mongoose.model('login', loginSchma);
/*here we end of created models for collectioh */


/*here we export our collection */
module.exports = login;
/*here we end of export our collection */