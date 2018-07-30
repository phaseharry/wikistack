const express = require('express');
const wiki = express.Router();
const { Pages, Users } = require('../db');
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikipage');
const mainPage = require('../views/main');

wiki.get('/', async (req, res) => {
  const allPages = await Pages.findAll();
  res.send(mainPage(allPages));
});

wiki.get('/add', (req, res) => {
  res.send(addPage());
});

wiki.get('/:slug', async (req, res, next) => {
  const requestedSlug = req.params.slug;
  try {
    const page = await Pages.findOne({
      where: { slug: requestedSlug },
    });
    const author = await Users.findById(page.authorId);
    //console.log(page.dataValues);
    res.send(wikiPage(page, author));
  } catch (error) {
    next(error);
  }
});

wiki.post('/', async (req, res, next) => {
  const page = req.body;
  const newPage = new Pages({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
  });

  try {
    const [author, wasCreated] = await Users.findOrCreate({
      where: { name: req.body.author, email: req.body.email },
    });

    newPage.setAuthor(author);
    await newPage.save();
    console.log(wikiPage(newPage, author));

    res.redirect(`/wiki/${newPage.slug}`);
  } catch (error) {
    next(error);
  }
});

module.exports = wiki;
