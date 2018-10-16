const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// Create Zoos
server.post('/api/zoos', (req, res) => {
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
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Get Zoo By ID
server.get('/api/zoos/:id', async (req, res) => {
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
server.put('/api/zoos/:id', (req, res) => {
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
server.delete('/api/zoos/:id', (req, res) => {
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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
