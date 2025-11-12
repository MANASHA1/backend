import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  website: { type: String, required: true },
  username: { type: String },
  encryptedPassword: { type: String, required: true },
  iv: { type: String, required: true },          // for AES IV
  strength: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Password", passwordSchema);
