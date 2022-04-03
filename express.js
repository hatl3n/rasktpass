const express = require('express');
const rasktpass = require('./index.js');
const app = express();
const port = 8080;

app.get('/getObj', async (req, res) => {
  let rp = await rasktpass();
  res.send(JSON.stringify(rp));
})

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
