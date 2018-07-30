const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
});

const Pages = db.define('pages', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: Sequelize.ENUM('open', 'closed'),
});

const Users = db.define('users', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Johnny Appleseed',
  },
  email: {
    type: Sequelize.STRING,
    defaultValue: 'johnnyappleseed@gmail.com',
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

Pages.belongsTo(Users, { as: 'author' });

function generateSlug(title) {
  // Removes all non-alphanumeric characters from title
  // And make whitespace underscore
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
}

Pages.beforeValidate((pageInstance, optionsObject) => {
  pageInstance.slug = generateSlug(pageInstance.title);
});

module.exports = {
  db,
  Pages,
  Users,
};
