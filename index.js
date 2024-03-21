const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (HTML, CSS)
app.use(express.static( path.join(__dirname, 'public')));

// Handle form submission
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({
    username,
    email,
    password
  });

  newUser.save()
  .then(user => {
    res.status(200).send('User registered successfully');
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Error registering user');
  });

});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});
