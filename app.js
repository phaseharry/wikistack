const express = require('express');
const bodyParser = require('body-parser');
const wikiRoute = require('./routes/wiki');
const userRoute = require('./routes/users');
const models = require(`./db`);

const app = express();

models.db.authenticate().then(() => console.log('database is connected'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/wiki', wikiRoute);
app.use('/users', userRoute);

const init = async () => {
  await models.db.sync({ force: false });
};

init();

app.get('/', (req, res) => {
  res.redirect('/wiki');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
