const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

User = mongoose.model('user', UserSchema);

mongoose.connect('mongodb://localhost:27017/config')
.then(()=> console.log('MongoDb Connected'))
.catch((err)=> console.log(err.message));