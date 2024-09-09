// models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  major: { type: String }, // New field
  university: { type: String }, // New field
  academicLevel: { type: String }, // New field
  yearOfUniversity: { type: Number }, // New field
  createdAt: { type: Date, default: Date.now },}
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
