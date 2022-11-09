const express = require("express");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication')


router.get("/", (req, res) => {
  res.send("hello");
});

router.get('/protected',authentication,(req,res)=>{
  res.send('hello protected')
})


router.post('/signup', (req, res) => {
    const {name, email, password } = req.body


    if(!email || !password || !name){
        res.status(422).json({error: 'Please fill all your fields'})
    }
    User.findOne({email:email}).then((savedUser) =>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that email"})
        }
        bcrypt.hash(password,12).then(hashedPassword => {
            const user = new User({
                email,
                password:hashedPassword,
                name
            })
            user.save().then(user => {
                res.json({message:"Saved successfully in mongodb"})
            }).catch(err => {
                console.log(err)
            })
        })
    }).catch(err => {
        console.log(err)
    })
    res.json({message:'Success'})
})




router.post("/signin", (req, res) => {

  const { email,  password } = req.body;

  if (!email || !password) {
     res.status(422).json({ error: "Please provide email or password." });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }

    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // return res.json({ message: "seccessfully signed in" });
          const token = jwt.sign({_id:savedUser.id}, 'secret')
          res.json({token})
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
