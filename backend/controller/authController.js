const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Import bcrypt
const generateToken = require('../utils/generateToken');

// Signup controller
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Default categories to be added for the user
        const defaultCategories = ['exercise', 'presentation', 'reading'];

        // Create a new user with hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword, // Store the hashed password
            categories: defaultCategories.map(categoryName => ({
                name: categoryName,
                items: [],  // Start with an empty items array
            })),
        });

        // Save the user to the database
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Return the user and token in the response
        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                categories: user.categories, // Return the categories as well
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the plain password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password); // bcrypt compares

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, login };
