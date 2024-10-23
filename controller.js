const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const SecretKey = 'abs@11234';


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const PostSchema = new mongoose.Schema({
    post: { type: String }
})


const Post = mongoose.model('Post', PostSchema)

const User = mongoose.model('User', UserSchema);


mongoose.connect('mongodb://localhost:27017/config')
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err.message));


exports.createToken = async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ UserId: savedUser._id }, SecretKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.CheckUser = async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, SecretKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.userPost = async (req, res) => {
    
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }

    jwt.verify(token, SecretKey, async (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        req.userId = decoded.userId;

        const { post } = req.body;
        if (!post) {
            return res.status(400).json({ message: 'Post content is required.' });
        }

        try {
            const newPost = new Post(req.body);

            const savedPost = await newPost.save();
            res.status(201).json({
                message: 'Post created successfully',
                post: savedPost
            });

        } catch (error) {
            console.error(error); 
            res.status(500).json({ message: 'Internal server error.' });
        }
    });
};