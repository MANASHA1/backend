import Password from "../models/Password";
import { encrypt, decrypt } from "../utils/encrypt.js";
import { checkStrength } from "../utils/strength.js";

// Create
export const createPassword = async (req, res) => {
  try {
    const { website, username, password } = req.body;
    if (!website || !password) return res.status(400).json({ msg: "website and password required" });
    const strength = checkStrength(password);
    const enc = encrypt(password);
    const newPass = new Password({
      website, username,
      encryptedPassword: enc.data,
      iv: enc.iv,
      strength
    });
    await newPass.save();
    res.status(201).json({ message: "Saved", strength });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all (returns decrypted password if you choose to)
export const getPasswords = async (req, res) => {
  try {
    const list = await Password.find().sort({ createdAt: -1 });
    // Optionally decrypt before sending — careful with exposure
    const result = list.map(p => ({
      id: p._id,
      website: p.website,
      username: p.username,
      password: decrypt(p.encryptedPassword, p.iv), // only if authorized
      strength: p.strength,
      createdAt: p.createdAt
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { website, username, password } = req.body;
    const doc = await Password.findById(id);
    if (!doc) return res.status(404).json({ msg: "Not found" });
    if (website) doc.website = website;
    if (username) doc.username = username;
    if (password) {
      const enc = encrypt(password);
      doc.encryptedPassword = enc.data;
      doc.iv = enc.iv;
      doc.strength = checkStrength(password);
    }
    await doc.save();
    res.json({ msg: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deletePassword = async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
