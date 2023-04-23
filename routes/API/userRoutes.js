const router = require ("express").Router();
const { User } = require("../../models")

//Get all the users
router.get("/", async (req, res)=>{
    try {
      const users = await User.find().populate("thoughts").populate("friends");
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  //Get a single user by its _id and populated thought and friend data
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("thoughts").populate("friends");
      res.status(200).json(user);
    } catch (err){
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  //Post a new user
  router.post("/", async (req, res) => {
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
  router.put("/:id", async (req, res) => {
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
  router.delete("/:id", async (req, res) => {
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
  router.post('/:userId/friends/:friendId', async (req, res) => {
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
  router.delete('/:userId/friends/:friendId', async (req, res) => {
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
  
  module.exports = router;
