const morgan = require('morgan');
const express = require('express');
const rasktpass = require('./index.js');
const app = express();
const port = 80;

var cachedJson = [0, ""]; // Format: unixtimems, jsonstring
const _10MIN = 600000; // 10 min in ms

app.use(morgan('combined'))

app.get('/getObj', async (req, res) => {
  let now = () => new Date().getTime();
  let toRespond;
  if ((cachedJson[0] + _10MIN) < now())
  {
    try {
      let rp = await rasktpass();
      cachedJson = [now(), rp];
      toRespond = rp;
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
    //console.log("Stored new cache");
  }
  else {
    toRespond = cachedJson[1];
    //console.log("Served from cache");
  }
  return res.send(JSON.stringify(toRespond));
})

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
