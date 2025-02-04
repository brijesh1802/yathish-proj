const User = require('../models/user');

const addCategory = async (req, res) => {
    const { categoryName } = req.body;
    const userId = req.user._id;

    if (!categoryName) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const categoryExists = user.categories.some(c => c.name === categoryName);
        if (categoryExists) {
            return res.status(400).json({ message: "Category already added" });
        }

        if (user.categories.length >= 8) {
            return res.status(400).json({ message: "Cannot have more than 8 categories" });
        }

        user.categories.push({ name: categoryName, items: [] });
        await user.save();

        res.status(200).json({ message: "Category added successfully", categories: user.categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const removeCategory = async (req, res) => {
    const { categoryName } = req.body;
    const userId = req.user._id;

    if (!categoryName) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.categories = user.categories.filter(c => c.name !== categoryName);
        await user.save();

        res.status(200).json({ message: "Category removed successfully", categories: user.categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ categories: user.categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
}

module.exports = { addCategory, removeCategory, getCategories };
