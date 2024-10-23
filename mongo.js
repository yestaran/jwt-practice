const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/local')
.then(()=> console.log('MongoDb Connected'))
.catch((err)=> console.log(err.message))