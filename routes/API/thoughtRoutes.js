const router = require ("express").Router();
const { Thought } = require("../../models");
const { User } = require("../../models")


// GET to get all thoughts
router.get("/", async (req, res)=>{
    try {
      const thoughts = await Thought.find()
      res.status(200).json(thoughts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// GET to get a single thought by its _id
router.get("/:id", async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id);
      res.status(200).json(thought);
    } catch (err){
      console.log(err);
      res.status(500).json(err);
    }
});

// POST to create a new thought and is added to the user´s thought array
router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
    const response = { message: "Thought added successfully", thought: thought };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    const response = { message: "There was an error adding the new thought", error: err };
    res.status(500).json(response);
  }
});


// PUT to update a thought by its _id
  router.put("/:id", async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {new: true});
      const response = { message: "Thought updated successfully", thought: thought };
      res.status(200).json(response);
    } catch (err){
      console.log(err);
      const response = { message: "There was an error updating the user", error: err };
      res.status(500).json(response);
    }
  });


// DELETE to remove a thought by its _id
router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.id });
    const response = { message: "Thought deleted successfully", thought: thought };
    res.status(200).json(response);
  } catch (err){
    console.log(err);
    const response = { message: "There was an error deleting the thought", error: err };
    res.status(500).json(response);
  }
})

// POST method to add a reaction to a thought
router.post('/:id/reactions', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    thought.reactions.push(req.body);
    const savedThought = await thought.save();
    res.status(200).json({ message: 'Reaction saved successfully', thought: savedThought });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    const reaction = thought.reactions.find(
      (reaction) => reaction.id === req.params.reactionId
    );
    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found' });
    }
    thought.reactions.pull(reaction);
    const savedThought = await thought.save();
    res.status(200).json({ message: 'Reaction deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});






module.exports = router;