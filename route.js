const express = require('express')
const controller = require('./controller')
const app = express()
app.use(express.json())


app.post('/register', async(req,res)=> {
        controller.createToken(req,res);
});

app.post('/login', async(req,res)=>{
    controller.CheckUser(req,res);
})

app.post('/create-post', async (req,res)=>{
    controller.userPost(req,res);
})

app.listen(5000, ()=>{
    console.log('server is running')
})