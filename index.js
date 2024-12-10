const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./Backend/Schemas/Userschema');
const path=require("path")
const bodyParser = require('body-parser');
const staticpath=path.join(__dirname,"./public/frontend/")
app.use(express.static(staticpath))
const Property = require("./Backend/Schemas/Proschema")
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
  res.send("HEllo")
});

// Add user endpoint
app.post('/adduser', async (req, res) => {
  const AddUser = new User({
    name: req.body.name,
    mailid: req.body.email,
    mobileno: req.body.mobile,
    address: req.body.address,
    password: req.body.password
  });

  try {
    await AddUser.save();
    res.status(201).json({msg:"Data Saved Success"});
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

//Property Operations

// Add property
app.post('/properties', async (req, res) => {
  try {
    const propertyData = {
        title: req.body.title,
        type: req.body['property-type'],
        location: req.body.location,
        address: req.body.address,
        price: req.body.price,
        rating: 0, // Assuming default rating, can be updated based on your logic area: 
        area: req.body.area,
        bedrooms: req.body.bedrooms,
        baths: req.body.baths,
        description: req.body.description,
        features: req.body.features.split(',').map(feature => feature.trim()),
        images: req.files.map(file => file.path),
        userId: req.body.userId // Assuming userId is sent in the request body 
    };
    const property = new Property(propertyData);
    await property.save();
    res.status(201).send(property);
}catch (err) {
    res.status(400).send(err);
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

//Search Property Buy.html Feature
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
