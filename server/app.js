const express = require('express');
const mongoose= require('mongoose')
const app= express();
const PORT = 8080
require('./models/User');
require('./models/post')

app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

mongoose.connect('mongodb+srv://Gezim:d979g933@cluster0.kmkrwct.mongodb.net/test')

mongoose.connection.on('connected', ()=>{
    console.log('Conected to mongodb')
})
mongoose.connection.on('error',()=>{
    console.log('Error conecting to mongodb')
})

app.listen(PORT , ()=>{
    console.log('Server ON');
})