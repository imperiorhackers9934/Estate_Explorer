const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./Backend/Userschema');

app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/estate_explorer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Home route
app.get('/', async (req, res) => {
  res.send("Hello");
});

// Add user endpoint
app.post('/adduser', async (req, res) => {
  const AddUser = new User({
    name: req.body.name,
    mailid: req.body.email,
    mobileno: req.body.mobile,
    password: req.body.password
  });

  try {
    await AddUser.save();
    res.status(201).send("Data Saved Success");
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user endpoint
app.put('/updateuser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        mailid: req.body.email,
        mobileno: req.body.mobile,
        password: req.body.password
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

// Delete user endpoint
app.delete('/deleteuser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
