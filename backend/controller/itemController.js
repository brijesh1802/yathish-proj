const User = require("../models/user");

const addItemToCategory = async (req, res) => {
    const { categoryName, item } = req.body;
    const userId = req.user._id;

    if (!categoryName || !item) {
        return res.status(400).json({ message: "Category name and item are required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const category = user.categories.find(c => c.name === categoryName);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (category.items.includes(item)) {
            return res.status(400).json({ message: "Item already exists in the category" });
        }

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
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const category = user.categories.find(c => c.name === categoryName);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.items = category.items.filter(i => i !== item);
        await user.save();

        res.status(200).json({ message: "Item removed successfully", categories: user.categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getItemsFromCategory = async (req, res) => {
    const { categoryName } = req.query;
  
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const category = user.categories.find(c => c.name === categoryName);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(200).json({ items: category.items });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

module.exports = { addItemToCategory,removeItemFromCategory,getItemsFromCategory };
