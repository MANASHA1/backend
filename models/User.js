// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
});

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  console.log("➡️ Running pre-save hook...");
  console.log("isNew:", this.isNew);
  console.log("Password modified:", this.isModified('password'));

  if (!this.isModified('password')) {
    console.log("⏭️ Password not modified — skipping hashing.\n");
    return next();
  }

  try {
    const saltRounds = 12;
    console.log("🔑 Hashing password with bcrypt...");
    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log("✅ Password hashed successfully!\n");
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Add method for password comparison
userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
