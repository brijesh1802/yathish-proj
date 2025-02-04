const express = require('express');
const { addItemToCategory, removeItemFromCategory } = require('../controller/itemController'); 
const protect = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/add',protect, addItemToCategory);  
router.delete('/remove',protect, removeItemFromCategory); 

module.exports = router;
