const { User, Thought} = require('../models');
const connection = require('../config/connection');

connection.once('open', async () => {
  try {
    await User.deleteMany();
    await Thought.deleteMany();

    const createdUsers = await User.insertMany([
      {
        username: 'john_smith',
        email: 'john.smith@example.com',
        thoughts: [],
        friends: []
      },
      {
        username: 'jane_doe',
        email: 'jane.doe@example.com',
        thoughts: [],
        friends: []
      },
      {
        username: 'bob_jones',
        email: 'bob.jones@example.com',
        thoughts: [],
        friends: []
      }
    ]);

    const createdThoughts = await Thought.insertMany([
      {
        thoughtText: 'Just had a great workout!',
        username: 'john_smith',
        reactions: []
      },
      {
        thoughtText: 'Excited to see the new movie tonight',
        username: 'jane_doe',
        reactions: []
      },
      {
        thoughtText: 'I love pizza so much',
        username: 'bob_jones',
        reactions: []
      }
    ]);

    for (let i = 0; i < createdThoughts.length; i++) {
      const thought = createdThoughts[i];
      const user = createdUsers.find(u => u.username === thought.username);
      user.thoughts.push(thought);
      await user.save();
    }

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

connection.on('error', err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
