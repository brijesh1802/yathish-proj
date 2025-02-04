const express = require('express');
const { addCategory, removeCategory, getCategories } = require('../controller/categoryController');
const  protect  = require('../middleware/authMiddleware'); 
const router = express.Router();


router.post('/add', protect, addCategory);  
router.delete('/remove', protect, removeCategory); 

router.get("/get", protect, getCategories)

module.exports = router;
