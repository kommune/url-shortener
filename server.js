const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Shorten = require('./home/models/shortenurl.js')

const app = express()

mongoose.connect('mongodb://user1:123123@ds119748.mlab.com:19748/your-mongodb-app');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  app.listen(3000, () => {
    console.log('Listening on port 3000...')
  })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + '/home')))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('index');
})

app.post('/shortenurl', (req,res) => {
  const short = Math.random().toString(36).substr(2,5);
  const newShorten = new Shorten ({
    longURL: req.body.longURL, 
    shortURL: short
  })

  Shorten.findOne({ longURL: req.body.longURL }, (err, document) => {
    if(document) {
      res.render( "shortenurl", {URL: document} )
    } else {
      newShorten.save((err,document) => {
        if (document) {
          res.render('shortenurl', {URL: document})
        } else { 
          return console.log(err)
        }
      }) 
    }
  })
})

app.get('/:inputURL', (req, res) => {
  let inputURL = req.params.inputURL
  Shorten.findOne({ shortURL: inputURL }, (err, document) => {
    if(document) {
      res.redirect( document.longURL )
    } else {
      res.render( 'index', { invalidURL: inputURL } )
    }
  })
})