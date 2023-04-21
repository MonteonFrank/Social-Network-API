// Import Mongoose
const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    reactionBody: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Define the thought schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: { 
    type: String, 
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt:{
    type: Date,
    default: Date.now,
    get: function (){
        return new Date(this._doc.createdAt).toLocaleString();
    }
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});

// Define the reactionCount virtual
thoughtSchema.virtual("reactionCount").get(function(){
    return this.reactions.length;
});

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;
