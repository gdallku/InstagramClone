const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

const User = mongoose.model('User');

module.exports =(req,res,next)=>{
    const {authorization}= req.headers
    if(!authorization){
        res.status(401).json({error:"You must be logged in"})
    }
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   const token = authorization.replace("Bearer ", "")
    jwt.verify(token,"secret", (error, payload)=>{
        if(error) throw res.status(401).json({error:"User must be logged in"})

        const {_id} =payload
        User.findById(_id).then(userdata =>{
            req.user = userdata
            userdata.password = undefined
            console.log('userdata', userdata)
            next();
        })
    })
}