const path = require('path');
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get('/randomword', async (req, res) => {
  const response = await fetch('https://wordsapiv1.p.rapidapi.com/words/?random=true', { 
    headers: {
      "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
      "x-rapidapi-key": process.env.WORD_API_KEY,
      "useQueryString": true
    }
  });
  const data = await response.json();
  return res.status(200).json({ word: data.word });
});

app.use('*', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});