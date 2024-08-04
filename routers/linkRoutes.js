import express from 'express';
import Link from '../models/Link.js';  // Adjust the path to your Link model if necessary

const router = express.Router();

// Add a new link
router.post('/', async (req, res) => {
  const { title, description, url } = req.body;
  const newLink = new Link({ title, description, url });

  try {
    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save link' });
  }
});

// Get all links
router.get('/', async (req, res) => {
  try {
    const links = await Link.find();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Update a link
router.put('/:id', async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const link = await Link.findByIdAndUpdate(req.params.id, {
      title,
      description,
      url
    }, { new: true });
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update link' });
  }
});

// Delete a link
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLink = await Link.findByIdAndDelete(id);
    if (!deletedLink) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.status(200).json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

export default router;
