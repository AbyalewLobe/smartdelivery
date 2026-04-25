import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    // Update password if provided
    if (password) {
      user.passwordHash = password; // Will be hashed by pre-save hook
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json({ success: true, data: userResponse, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add address
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, notes, coordinates } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses.push({ label, street, city, notes, coordinates });
    await user.save();

    res.status(201).json({ success: true, data: user.addresses, message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, street, city, notes, coordinates } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (label) address.label = label;
    if (street) address.street = street;
    if (city) address.city = city;
    if (notes !== undefined) address.notes = notes;
    if (coordinates) address.coordinates = coordinates;

    await user.save();

    res.json({ success: true, data: user.addresses, message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses.pull(id);
    await user.save();

    res.json({ success: true, data: user.addresses, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
