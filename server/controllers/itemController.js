const Item = require('../models/Item');

// @desc    Create an item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  const { title, description, category, condition, price, images } = req.body;

  // Validate required fields
  if (!title || !category || !condition) {
    return res.status(400).json({ message: 'Please provide title, category, and condition' });
  }

  try {
    const item = new Item({
      title,
      description,
      category,
      condition,
      price: price || 0,
      images: images || [],
      seller: req.user, // Got this from the protect middleware
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all available items (with filtering and search)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, condition } = req.query;

    // Start with items that are available
    let query = { status: 'available' };

    // Filter by Category
    if (category) {
      query.category = { $in: category.split(',') };
    }

    // Filter by Condition
    if (condition) {
      query.condition = { $in: condition.split(',') };
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Search text (in title, description, or category)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query, sort by newest first, and populate seller details
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .populate('seller', 'name email branch year phone');

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged-in user's items
// @route   GET /api/items/mine
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller', 'name email branch year phone');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an item
// @route   PATCH /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the logged-in user is the seller of the item
    if (item.seller.toString() !== req.user) {
      return res.status(403).json({ message: 'User not authorized to update this item' });
    }

    // Update fields if they exist in the request body
    const { title, description, category, condition, price, images, status } = req.body;
    
    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (price !== undefined) item.price = price;
    if (images) item.images = images;
    if (status) item.status = status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the logged-in user is the seller of the item
    if (item.seller.toString() !== req.user) {
      return res.status(403).json({ message: 'User not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
};
