const express = require('express');
const router = express.Router();
const userList = require('../views/userList');
const userPages = require('../views/userPages');
const { Users, Pages } = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const allUsers = await Users.findAll();
    res.send(userList(allUsers));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await Users.findById(userId);
    const allPages = await Pages.findAll({
      where: {
        authorId: userId,
      },
    });
    res.send(userPages(user, allPages));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
