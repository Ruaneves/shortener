require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const dns = require('dns')
const Database = require("@replit/database")

const app = express();
const db = new Database()

const port = process.env.PORT || 3000;

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  return res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  try {
      var url = new URL(req.body.url)
      
      return dns.lookup(url.hostname, (err) => {
        if (err) {
          return res.json({error:'invalid url'});
        } else {
          var short = Math.floor(Date.now() * 0.10);
          
          db.get(short.toString()).then(value => {
            if (!value) return res.json({error:'invalid url'});
            short = Math.floor(Date.now() * 0.25);
          });
          
          db.set(short.toString(), req.body.url);
          
          return res.json({
            original_url: req.body.url,
            short_url: short,
          });
        }
      })
  } catch (error) {
      return res.json({error:'invalid url'});
  }


});

app.get('/api/shorturl/:key', function(req, res) {
  if (!req.params.key) return res.status(400).json({error:"invalid url"});
  
  return db.get(req.params.key.toString()).then(value => {
    if (!value) return res.status(400).json({error:"invalid url"});
    
    console.log(`código ${req.params.key.toString()} acessado, redirecionando para ${value}`);
  
    return res.redirect(value);
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
