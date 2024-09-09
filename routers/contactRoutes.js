import express from 'express';
const router = express.Router();
import Contact from '../models/Contact.js';

// Create a new contact
router.post('/', async (req, res) => {
    const { 
        firstName, lastName, email, password, mobileNumber, dateOfBirth, 
        gender, location, major, university, academicLevel, yearOfUniversity 
    } = req.body;

    console.log('Received Contact Data:', {
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        dateOfBirth,
        gender,
        location,
        major,
        university,
        academicLevel,
        yearOfUniversity
    });

    const newContact = new Contact({
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        dateOfBirth,
        gender,
        location,
        major,
        university,
        academicLevel,
        yearOfUniversity
    });

    try {
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
