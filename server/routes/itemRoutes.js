const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.get('/mine', protect, getMyItems);

router.route('/:id')
  .get(getItemById)
  .patch(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
