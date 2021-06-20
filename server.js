const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path'); // Make style sheet available to the client.
const exphbs = require('express-handlebars');
const session = require('express-session');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const hbs = exphbs.create({ helpers });
const sess = {
  secret: 'yoursecretstring',
  cookie: {
    maxAge: 7200000 // 2 hours
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(sess));
// turn on routes
app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });