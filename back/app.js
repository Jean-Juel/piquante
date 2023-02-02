const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const path = require('path');
require('dotenv').config()
const helmet = require('helmet')
const morgan = require('morgan')

const stuffRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app
  .use(morgan('dev'))
  .use(bodyParse())
  .use(helmet({
    crossOriginResourcePolicy: false
  }))

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
