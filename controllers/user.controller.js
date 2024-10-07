// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// class UserController {
//   signIn = async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       let user = await User.findOne({ email });
//       if (!user) {
//         return res.status(400).json({ error: "There is no user with this email" });
//       }
      
//       // Use the comparePassword method from the User model
//       let match = await bcrypt.compare(password, user.password);
//       if (match) {
//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         const { email, fullName } = user;
//         return res.status(200).json({ token, user: { email, fullName } });
//       } else {
//         return res.status(403).json({ error: "Wrong Password" });
//       }
//     } catch (error) {
//       console.error("An error occurred during login:", error);
//       return res.status(500).json({ error: "An error occurred during login" });
//     }
//   };

//   signUp = async (req, res) => {
//     try {
//       const userDetails = req.body;
//       const { email, phoneNumber, password } = userDetails;

//       // Check if the phoneNumber field is provided
//       if (!phoneNumber) {
//         return res.status(400).json({ error: "Phone number is required" });
//       }

//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(403).json({ error: "This email has already been used" });
//       } else {
//         // Hash the password before saving
//         let hashed = await bcrypt.hash(password, 4);
//       userDetails.password = hashed;

//         let newUser = await User.create(userDetails);
//         const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         return res.status(200).json({ token, user: { email: newUser.email, phoneNumber: newUser.phoneNumber } });
//       }
//     } catch (error) {
//       console.error("An error occurred during registration:", error);
//       return res.status(500).json({ error: "An error occurred during registration" });
//     }
//   };

//   getProfile = async (req, res) => {
//     try {
//       const userId = req.user._id; // The user ID extracted from the token
//       const user = await User.findById(userId).select('-password'); // Exclude the password
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
//       res.status(200).json(user);
//     } catch (error) {
//       console.error("Internal server error:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

//   updateProfile = async (req, res) => {
//     try {
//       const userId = req.user._id; // Extract user ID from token
//       const updateData = req.body; // Data to update
  
//       // Validate and sanitize updateData as needed
  
//       // Update user profile
//       const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       res.status(200).json(user);
//     } catch (error) {
//       console.error("Internal server error:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
    
//   };
// }

// module.exports = UserController;


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class UserController {
  // Sign-up / Register controller
signUp = async (req, res) => {
  try {
    const userDetails = req.body;
    const { email, password } = userDetails;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ error: "This email has already been used" });
    }

    // Hash the password before saving
    let hashed = await bcrypt.hash(password, 10);
    userDetails.password = hashed;
    console.log("Hashed password saved in DB:", hashed); // Log hashed password

    let newUser = await User.create(userDetails);

    const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token, user: { email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error("Sign-up error:", error);
    return res.status(500).json({ error: "An error occurred during registration" });
  }
};

// Sign-in / Login controller
signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "There is no user with this email" });
    }

    // Compare the password with the hashed password in the DB
    let match = await bcrypt.compare(password, user.password);
    console.log("Password match result:", match); // Log match result

    if (match) {
      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, user: { email: user.email, role: user.role } });
    } else {
      return res.status(403).json({ error: "Wrong Password" });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
}

  // Get user profile (e.g., after login)
  getProfile = async (req, res) => {
    try {
      const userId = req.user._id; // User ID from the token
      const user = await User.findById(userId).select('-password'); // Exclude password from the response
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // Update user profile
  updateProfile = async (req, res) => {
    try {
      const userId = req.user._id; // User ID from the token
      const updateData = req.body; // Data to update

      // Validate and sanitize updateData as needed
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

  // Method to create an admin user
  createAdminUser = async () => {
    try {
      const adminDetails = {
        name: "Irefin David",
        email: "davidoluwasemiloorei@gmail.com",
        phoneNumber: "09167735079",
        password: "david472002@",
        role: "admin",
      };

      // Hash the password
      const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
      adminDetails.password = hashedPassword;

      // Check if the admin email already exists
      let user = await User.findOne({ email: adminDetails.email });
      if (user) {
        console.log("Admin user already exists");
      } else {
        // Create and save the admin user
        const adminUser = new User(adminDetails);
        await adminUser.save();
        console.log("Admin user created:", adminUser);
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  };
}

module.exports = UserController;
