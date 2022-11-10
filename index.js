require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bp = require('body-parser');


const app = express();

const port = process.env.PORT || 3000;

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  if (!req.body.url) return res.status(400).json({error:"Invalid URL"})

  res.json({
    original_url: req.body.url,
    short_url: Math.floor(Date.now() * 0.10),
  });

  console.log(req.body)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
