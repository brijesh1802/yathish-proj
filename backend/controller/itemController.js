const User = require("../models/user");

// Add an item to a specific category for a user
const addItemToCategory = async (req, res) => {
    const { categoryName, item } = req.body;
    const userId = req.user._id;

    if (!categoryName || !item) {
        return res.status(400).json({ message: "Category name and item are required" });
    }

    try {
        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the category
        const category = user.categories.find(c => c.name === categoryName);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if the item already exists
        if (category.items.includes(item)) {
            return res.status(400).json({ message: "Item already exists in the category" });
        }

        // Add the item to the category's items array
        category.items.push(item);
        await user.save();

        res.status(200).json({ message: "Item added successfully", categories: user.categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const removeItemFromCategory = async (req, res) => {
    const { categoryName, item } = req.body;
    const userId = req.user._id;

    if (!categoryName || !item) {
        return res.status(400).json({ message: "Category name and item are required" });
    }

    try {
        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the category
        const category = user.categories.find(c => c.name === categoryName);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Remove the item from the category
        category.items = category.items.filter(i => i !== item);
        await user.save();

        res.status(200).json({ message: "Item removed successfully", categories: user.categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { addItemToCategory,removeItemFromCategory };
