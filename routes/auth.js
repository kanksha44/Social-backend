const router = require ('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req,resp)=>{
       try{

//generate new password
const salt =await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

//create new user
const newUser = new User ({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
});

//save user and  respond
     const user = await newUser.save();
     resp.status(200).json(user);
    } catch(err){
        resp.status(500).json(err)
    }    
})

//login
router.post('/login',async(req,resp)=>{
    try{
    const user= await User.findOne({email:req.body.email});
    !user && resp.status(404).send('User Not Found');

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && resp.status(400).json('Wrong Password');

    resp.status(200).json(user)

    }catch (err){
        resp.status(500).json(err)
    }
})
 
module.exports= router;