const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const Models = require('../models/DataModels');

// Helper to map route parameter to Mongoose Model
const getModel = (type) => {
    switch(type) {
        case 'projects': return Models.Project;
        case 'blog': return Models.Blog;
        case 'certifications': return Models.Certification;
        case 'education': return Models.Education;
        case 'messages': return Models.Message;
        case 'profile': return Models.Profile;
        case 'skills': return Models.Skill;
        default: return null;
    }
};

// Valid data types
const VALID_TYPES = ['projects', 'blog', 'skills', 'profile', 'messages', 'certifications', 'education'];

// ─── GET /api/data/:type — PUBLIC (no auth) ───────
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  const Model = getModel(type);

  if (!Model) {
    return res.status(400).json({ error: `Invalid type: ${type}` });
  }

  try {
      if (type === 'profile' || type === 'skills') {
          // Singleton documents
          const doc = await Model.findOne({ id: 'singleton' }).lean();
          if (!doc) {
               return res.status(404).json({ error: `Data not found: ${type}` });
          }
          // Remove internal mongodb _id before sending
          delete doc._id;
          delete doc.__v;
          return res.json(doc);
      } else {
          // Collections (arrays)
          const docs = await Model.find().sort({ time: -1 }).lean();
          
          const formattedData = docs.map(doc => {
              delete doc._id;
              delete doc.__v;
              return doc;
          });
          
          return res.json(formattedData);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// ─── POST /api/data/messages — PUBLIC (contact form) ──
router.post('/messages', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
      const newMessage = new Models.Message({
          id: Date.now().toString(),
          name,
          email,
          message,
          time: Date.now(),
      });

      await newMessage.save();
      
      const responseData = newMessage.toObject();
      delete responseData._id;
      delete responseData.__v;
      
      res.status(201).json({ message: 'Message sent successfully', data: responseData });
  } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
  }
});

// ─── POST /api/data/:type — ADMIN (add item) ─────
router.post('/:type', authMiddleware, async (req, res) => {
  const { type } = req.params;
  const Model = getModel(type);

  if (!Model) {
    return res.status(400).json({ error: `Invalid type: ${type}` });
  }

  try {
      if (type === 'profile' || type === 'skills') {
          // Find and update, or insert if not exists
          const doc = await Model.findOneAndUpdate(
              { id: 'singleton' },
              { ...req.body, id: 'singleton' },
              { new: true, upsert: true, setDefaultsOnInsert: true }
          ).lean();

          delete doc._id;
          delete doc.__v;
          
          return res.json({ message: `${type} updated`, data: doc });
      }

      // Arrays (projects, blog, etc)
      const newItemData = {
        id: `${type.slice(0, -1)}-${Date.now()}`,
        ...req.body,
        time: Date.now(), // Always set time to current timestamp
      };

      // Remove stats if they were sent
      delete newItemData.stats;

      const newItem = new Model(newItemData);
      await newItem.save();
      
      const responseData = newItem.toObject();
      delete responseData._id;
      delete responseData.__v;

      res.status(201).json({ message: 'Item added', data: responseData });
  } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: 'Failed to add item' });
  }
});

// ─── PUT /api/data/:type/:id — ADMIN (edit item) ──
router.put('/:type/:id', authMiddleware, async (req, res) => {
  const { type, id } = req.params;
  const Model = getModel(type);

  if (!Model) {
    return res.status(400).json({ error: `Invalid type: ${type}` });
  }

  try {
      if (type === 'profile' || type === 'skills') {
          // Singleton update
          const doc = await Model.findOneAndUpdate(
              { id: 'singleton' },
              { $set: req.body },
              { new: true }
          ).lean();
          
          if (!doc) return res.status(404).json({ error: `Item not found` });
          delete doc._id; delete doc.__v;
          
          return res.json({ message: `${type} updated`, data: doc });
      }

      const doc = await Model.findOneAndUpdate(
          { id: id },
          { $set: req.body },
          { new: true }
      ).lean();
      
      if (!doc) {
        return res.status(404).json({ error: `Item not found: ${id}` });
      }

      delete doc._id; delete doc.__v;
      res.json({ message: 'Item updated', data: doc });
  } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Failed to update item' });
  }
});

// ─── DELETE /api/data/:type/:id — ADMIN (delete) ──
router.delete('/:type/:id', authMiddleware, async (req, res) => {
  const { type, id } = req.params;
  const Model = getModel(type);

  if (!Model) {
    return res.status(400).json({ error: `Invalid type: ${type}` });
  }

  if (type === 'profile' || type === 'skills') {
    return res.status(400).json({ error: 'Cannot delete profile or skills, use PUT to update' });
  }

  try {
      const doc = await Model.findOneAndDelete({ id: id }).lean();
      
      if (!doc) {
        return res.status(404).json({ error: `Item not found: ${id}` });
      }

      delete doc._id; delete doc.__v;
      res.json({ message: 'Item deleted', data: doc }); 
  } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
