import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash the password
userSchema.pre('save', function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // Hash the password using the generated salt
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      // Override the cleartext password with the hashed one
      this.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema);

export default User;
