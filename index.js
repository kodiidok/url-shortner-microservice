require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
// When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
// If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);
  
  if (!url.includes('https://') && !url.includes('http://')) {
    res.json({ error: 'invalid url' });    
  }
  
  if (foundIndex < 0) {
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);
    res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    });
  }

  res.json({
    original_url: url,
    short_url: foundIndex
  });
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const foundIndex = shortUrls.indexOf(shorturl);

  if (foundIndex < 0) {
    return res.json({
      "error": "No short URL found for the given input"
    });
  }

  res.redirect(originalUrls[foundIndex]);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
