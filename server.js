const express = require('express');
const db = require('./config/connection');

const { User, Thought } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Get all the users
app.get("/api/users", async (req, res)=>{
  try {
    const users = await User.find().populate("thoughts").populate("friends");
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Get a single user by its _id and populated thought and friend data
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("thoughts").populate("friends");
    res.status(200).json(user);
  } catch (err){
    console.log(err);
    res.status(500).json(err);
  }
});

//Post a new user
app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const response = { message: "User added successfully", user: user };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    const response = { message: "There was an error adding new user", error: err };
    res.status(500).json(response);
  }
});

// PUT to update a user by its _id
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    const response = { message: "User updated successfully", user: user };
    res.status(200).json(response);
  } catch (err){
    console.log(err);
    const response = { message: "There was an error updating the user", error: err };
    res.status(500).json(response);
  }
});

//Delete to remove a user by its _id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    const response = { message: "User deleted successfully", user: user };
    res.status(200).json(response);
  } catch (err){
    console.log(err);
    const response = { message: "There was an error deleting the user", error: err };
    res.status(500).json(response);
  }
})

// POST to add a new friend to a user's friend list
app.post('/api/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      const response = { message: 'User or friend not found' };
      return res.status(404).json(response);
    }

    if (user.friends.includes(friendId)) {
      const response = { message: 'Friend already exists in user\'s friend list' };
      return res.status(400).json(response);
    }

    user.friends.push(friendId);
    await user.save();

    const response = { message: 'Friend added successfully', user: user };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    const response = { message: 'There was an error adding the friend', error: err };
    res.status(500).json(response);
  }
});

// DELETE to remove a friend from a user's friend list
app.delete('/api/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      const response = { message: 'User not found' };
      return res.status(404).json(response);
    }

    if (!user.friends.includes(friendId)) {
      const response = { message: 'Friend not found in user\'s friend list' };
      return res.status(400).json(response);
    }

    user.friends.pull(friendId);
    await user.save();

    const response = { message: 'Friend removed successfully', user: user };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    const response = { message: 'There was an error removing the friend', error: err };
    res.status(500).json(response);
  }
});



//Ensure the application is running
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
