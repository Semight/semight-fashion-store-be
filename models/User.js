// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phoneNumber: { type: String, required: true },
//   password: { type: String, required: true },
//   role: { type: String, default: 'user' } // Example roles: user, admin
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Example roles: user, admin
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Skip hashing if the password is not modified
  }

  try {
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Higher value makes the hash stronger
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error); // Handle any error in hashing
  }
});

// Compare hashed passwords (useful for login)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
