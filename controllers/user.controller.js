const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

class UserController {
  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "There is no user with this email" });
      }
      
      // Use the comparePassword method from the User model
      let match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { email, fullName, role } = user;
        return res.status(200).json({ token, user: { email, fullName, role } });
      } else {
        return res.status(403).json({ error: "Wrong Password" });
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      return res.status(500).json({ error: "An error occurred during login" });
    }
  };

  signUp = async (req, res) => {
    try {
      const userDetails = req.body;
      const { email, phoneNumber, password } = userDetails;

      // Check if the phoneNumber field is provided
      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      let user = await User.findOne({ email });
      if (user) {
        return res.status(403).json({ error: "This email has already been used" });
      } else {
        // Hash the password before saving
        let hashed = await bcrypt.hash(password, 4);
      userDetails.password = hashed;

        let newUser = await User.create(userDetails);
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, user: { email: newUser.email, phoneNumber: newUser.phoneNumber } });
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
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
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  updateProfile = async (req, res) => {
    try {
      const userId = req.user._id; // Extract user ID from token
      const updateData = req.body; // Data to update
  
      // Validate and sanitize updateData as needed
  
      // Update user profile
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
    
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude passwords from the response
      res.status(200).json(users);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select('-password'); // Exclude password
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate if the userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Optional: Check if the user has permission to delete (e.g., check if they are an admin)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Forgot Password Endpoint
forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    // Generate a reset token (JWT)
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the reset link to the user's email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password:\n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
};

// Reset Password Endpoint
resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "An error occurred while resetting the password" });
  }
};


}

module.exports = UserController;
