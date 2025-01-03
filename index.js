const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./Backend/Schemas/Userschema');
const path = require('path');
const staticpath = path.join(__dirname, "./public/frontend/");
app.use(express.static(staticpath));
const Property = require("./Backend/Schemas/Proschema");
app.use(express.json()); // Middleware to parse JSON

// JWT Secret Key
const JWT_SECRET = 'T@ni&hq9936'; // Replace with your actual secret key


// Setup for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    const newFilename = `custom_${req.body.newname}${path.extname(file.originalname)}`;
    cb(null, newFilename); // Custom file name
  }
});

// Multer configuration to handle multiple files and limit to 10
const upload = multer({
  storage,
  limits: { files: 10, fileSize: 10 * 1024 * 1024 }, // Limit 10 files and 10MB per file
}).array('files'); // Use .array for multiple files


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/estate_explorer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Home route
app.get('/getname/:id', async (req, res) => {
  try {
    const usr = await User.findById(req.params.id);
    if (!usr) return res.status(404).send('User invalid');
    res.json({"name":usr.name,
      "mobile":usr.mobileno,
      "mailid":usr.mailid
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add user endpoint
app.post('/adduser', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('mobileno').isMobilePhone().withMessage('Invalid mobile number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, mobileno, address, password } = req.body;

  try {
    const userExists = await User.findOne({ mailid: email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, mailid: email, mobileno, address, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ msg: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user', details: error.message });
  }
});


// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ mailid: email }); // Ensure consistent field name
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ msg: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
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
        email: req.body.email,
        mobileno: req.body.mobileno,
        password: await bcrypt.hash(req.body.password, 10)
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

//Property Operations

// Add property
app.post('/properties', async (req, res) => {
  try {
    // Extract the auth-token from req.body.userId
    const token = req.body.userId;

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET); // This will extract the userId

    // Add the newname to req.body
    req.body.newname = decoded.userId;

    // Create propertyData with user-specific data
    const propertyData = {
      title: req.body.title,
      type: req.body.type,
      location: req.body.location,
      address: req.body.address,
      price: req.body.price,
      rating: 0, // Default rating
      area: req.body.area,
      bedrooms: req.body.bedrooms,
      baths: req.body.baths,
      description: req.body.description,
      features: req.body.features.split(","),
      images: [], // This will be populated after file upload
      userId: decoded.userId // Extracted userId from the token
    };
    console.log(propertyData)
    // Upload files
    upload(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).send('You can upload a maximum of 10 files.');
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send('File size is too large (max 10MB per file).');
        }
        return res.status(400).send('Error uploading files.');
      }

      if (req.files && req.files.length > 0) {
        // Update the propertyData with uploaded filenames
        propertyData.images = req.files.map(file => file.filename);
      } else {
        return res.status(400).send('No files uploaded.');
      }

      // Save the property to the database
      const property = new Property(propertyData);
      await property.save();

      res.status(201).send(property); // Respond with the saved property
    });
    
  } catch (err) {
    // Handle errors appropriately
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired' });
    } else {
      return res.status(400).send(err);
    }
  }
});

// Read all properties
app.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.send(properties);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read single property
app.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).send('Property not found');
    res.send(property);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Read Properties of a specific user
app.get('/userproperties/:id', async (req, res) => {
  try {
    const property = await Property.find({"userId":req.params.id});
    if (!property) return res.status(404).send('Property not found');
    res.json(property);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update property
app.put('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return res.status(404).send('Property not found');
    res.send(property);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete property
app.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).send('Property not found');
    res.send(property);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Search Property Buy.html Feature
app.get('/search-properties', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice
    } = req.query;
    const filter = {
      location: new RegExp(search, 'i'),
      type: category,
      price: {
        $gte: Number(minPrice),
        $lte: Number(maxPrice)
      }
    };
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
