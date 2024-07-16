const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User Created');
    } catch (err) {
        res.status(400).send('Error Creating User');
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Invalid Email or Password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid Email or Password');
    }
    res.status(200).send('Login Successful');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

async function auth(emailId, passwordId, action) {
    const email = document.getElementById(emailId).value;
    const password = document.getElementById(passwordId).value;

    const response = await fetch(`http://localhost:3000/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.text();
    if (response.status === 200 || response.status === 201) {
        window.location.assign("questions.html");
    } else {
        alert(result);
    }
}

document.getElementById('signUpButton').addEventListener('click', () => auth('signUpEmail', 'signUpPassword', 'signup'));
document.getElementById('signInButton').addEventListener('click', () => auth('signInEmail', 'signInPassword', 'signin'));
