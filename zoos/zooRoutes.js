const express = require('express');
const knex = require('knex');
const router = express.Router();
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

// Create Zoos
router.post('/', (req, res) => {
  const name = req.body;

  db.insert(name)
    .into('zoos')
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Get All Zoos
router.get('/', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Get Zoo By ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const zoo = await db('zoos')
      .where({ id })
      .first();

    if (zoo) {
      res.status(200).json(zoo);
    } else {
      res.status(404).json({ message: 'Zoo not found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Zoo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('zoos')
    .where({ id })
    .update(changes)
    .then(count => {
      if (!count || count < 1) {
        res.status(404).json({ message: 'No records founds to update' });
      }
      res.status(200).json(count);
    })
    .catch(err => res.status(500).json(err));
});

// Delete Zoo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('zoos')
    .where({ id })
    .del(changes)
    .then(count => {
      if (!count || count < 1) {
        res.status(404).json({ message: 'No records founds to delete' });
      }
      res.status(200).json(count);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
