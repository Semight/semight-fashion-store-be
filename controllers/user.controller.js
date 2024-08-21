const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class UserController {
  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "There is no user with this email" });
      }
      let match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { email, fullName } = user;
        return res.status(200).json({ token, user: { email, fullName } });
      } else {
        return res.status(403).json({ error: "Wrong Password" });
      }
    } catch (error) {
      return res.status(500).json({ error: "An error occurred during login" });
    }
  };

  signUp = async (req, res) => {
    try {
      const userDetails = req.body;
      const { email } = userDetails;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(403).json({ error: "This email has already been used" });
      } else {
        let newUser = await User.create(userDetails);
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, user: { email: newUser.email } });
      }
    } catch (error) {
      return res.status(500).json({ error: "An error occurred during registration" });
    }
  };

  getProfile = async (req, res) => {
    try {
      const userId = req.user._id; // The user ID extracted from the token
      const user = await User.findById(userId).select('-password'); // Exclude the password
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  
}

module.exports = UserController;
