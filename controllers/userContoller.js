// controllers/userController.js
const User = require('../models/User');

// ✅ Create a new user (register)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password,role });
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ message: 'User created successfully', user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};



// 📄 Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// 📄 Get one user
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // req.user.userId comes from authMiddleware after JWT verification
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Cannot access other users' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
};


// ✏️ Update user (with model middleware)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update allowed fields manually
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;
    if (req.body.password) user.password = req.body.password; // <-- plain password, will be hashed automatically

    await user.save(); // ✅ triggers pre('save') hook
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json(safeUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ message: 'Invalid ID' });
  }
};


// 🗑️ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', user: deleted });
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
};
