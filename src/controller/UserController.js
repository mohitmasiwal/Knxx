import jwt from "jsonwebtoken";
import User from "../modals/UserModal.js";
 
 export const CreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


 
export const GetUser = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "No users found" });
  }
};
 
export const GetUserById = async (req, res) => {
  try {
    const userById = await User.findById(req.params.id);
    res.status(200).json(userById);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "No user found" });
  }
};

 


export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isUser.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: isUser._id, role: isUser.role },
      "mohit_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: isUser._id,
        name: isUser.name,
        email: isUser.email,
        role: isUser.role,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

