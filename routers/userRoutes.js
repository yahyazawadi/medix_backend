//backend\routers\userRoutes.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { 
      firstName, lastName, email, password, mobileNumber, dateOfBirth, 
      gender, location, major, university, academicLevel, yearOfUniversity 
    } = req.body;

    console.log('Received Data:', req.body); // Log the data received from the frontend

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName, lastName, email, password: hashedPassword, mobileNumber, dateOfBirth,
      gender, location, major, university, academicLevel, yearOfUniversity
    });

    const savedUser = await newUser.save();
    console.log('User Saved:', savedUser); // Log the saved user

    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error('Failed to create user:', error); // Log errors
    res.status(400).json({ message: 'Failed to create user', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const Users = await User.find();
    console.log('Fetched Users:', Users); // Log fetched users
    res.status(200).json(Users);
  } catch (error) {
    console.error('Failed to get users:', error); // Log errors
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

router.get('/email', async (req, res) => {
  try {
    const user = await User.findOne();
    if (user) {
      res.json({ email: user.email });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user email', error: error.message });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt with email: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log('Login successful');
        res.json({ success: true, message: 'Login successful', user });
      } else {
        console.log('Invalid password');
        res.json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      console.log('User not found');
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Failed to login:', error);
    res.status(500).json({ message: 'Failed to login', error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { 
      firstName, lastName, email, password, mobileNumber, dateOfBirth, 
      gender, location, major, university, academicLevel, yearOfUniversity 
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { 
        firstName, lastName, email, password, mobileNumber, dateOfBirth,
        gender, location, major, university, academicLevel, yearOfUniversity
      }, 
      { new: true }
    );

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});


export default router;
