const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {errorHandler} =  require('./Middleware/errorHandler')
const dotenv = require('dotenv').config();
const cron = require('cron').CronJob
const {runSetAbonnementValidity} = require('./Controllers/abonnement')

const Abonnement = require('./Models/abonnement')
const {setAbonnementValidity} = require ('./Middleware/setAbonnementValidity')

const app = express()
const port = 3100

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/enseignants', require('./Routes/enseignant') );
app.use('/api/apprenants', require('./Routes/apprenant') );
app.use('/api/appel-offres', require('./Routes/appelOffre'))
app.use('/api/abonnements', require('./Routes/abonnement'))
app.use('/api/abonnements-types', require('./Routes/abonnementType'))
app.use(errorHandler);

// connect to the mongoDB
mongoose.connect(
  'mongodb+srv://mkoner:mkonermongo@cluster0.kenhj.mongodb.net/KalanFa?retryWrites=true&w=majority', 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
).then(success => {

  console.log('Connected to MongoDB');
  
  // start the server
  app.listen(port, () => {
      console.log(`KalanFa Server listening at : ${port} started at ${new Date()}`);
  });

}).catch(error => {
  console.log('Error in Connection ' + error);
});

// run setAbonnementValidity job
const task = new cron('0 0 * * *',()=> runSetAbonnementValidity())
task.start()



