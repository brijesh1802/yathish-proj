const express = require('express');
const { addCategory, removeCategory } = require('../controller/categoryController');
const  protect  = require('../middleware/authMiddleware'); 
const router = express.Router();


router.post('/add', protect, addCategory);  
router.delete('/remove', protect, removeCategory); 

module.exports = router;
