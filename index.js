const express = require('express')
const app = express()
const port = 3000
const mongoose =require('mongoose')
const User = require('./Backend/Userschema')
mongoose.connect('mongodb://127.0.0.1:27017/estate_explorer')
app.get('/',async (req, res) => {
  res.send("Hello")
})
app.post('/adduser',async (req,res)=>{

    const AddUser = new User({
        name:req.body.name,
        mailid:req.body.email,
        mobileno:req.body.mobile,
        password:req.body.password
      })
      await AddUser.save()
    console.log(req)
      res.send("Data Saved Success")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})