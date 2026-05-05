import Category from '../models/Category.js';

// Helper: get display name from localized object
const getDisplayName = (nameObj) => nameObj?.en || nameObj?.am || '';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const { type, activeOnly = 'true' } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (activeOnly === 'true') filter.isActive = true;

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category (admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    // name can be { en, am } or a plain string (backward compat)
    const nameObj = typeof name === 'object' ? name : { en: name, am: '' };

    const category = await Category.create({ name: nameObj, type });
    res.status(201).json({ success: true, data: category, message: 'Category created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    if (name !== undefined) {
      category.name = typeof name === 'object' ? name : { en: name, am: category.name?.am || '' };
    }
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json({ success: true, data: category, message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed default categories
export const seedDefaultCategories = async (req, res) => {
  try {
    const defaults = [
      { name: { en: 'Grocery', am: 'ሸቀጣሸቀጥ' }, type: 'shop' },
      { name: { en: 'Restaurant', am: 'ምግብ ቤት' }, type: 'shop' },
      { name: { en: 'Pharmacy', am: 'ፋርማሲ' }, type: 'shop' },
      { name: { en: 'Electronics', am: 'ኤሌክትሮኒክስ' }, type: 'shop' },
      { name: { en: 'Fashion', am: 'ፋሽን' }, type: 'shop' },
      { name: { en: 'Other', am: 'ሌላ' }, type: 'shop' },
    ];

    const created = [];
    for (const cat of defaults) {
      const existing = await Category.findOne({ 'name.en': cat.name.en, type: cat.type });
      if (!existing) {
        created.push(await Category.create(cat));
      }
    }

    res.json({ success: true, message: `Seeded ${created.length} categories`, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
